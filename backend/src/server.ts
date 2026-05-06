import express, { Request, Response } from "express";
import cors from "cors";
import { pool, testConnection } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const app = express();

app.use(cors()); // Permet à ton frontend Next.js (port 3000)
app.use(express.json()); // Permet de lire le body des requêtes en JSON

app.get("/api/projects", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.status,
        COALESCE(SUM(CASE WHEN s.status = 'done' THEN 1 ELSE 0 END), 0) AS completed_count,
        COALESCE(SUM(CASE WHEN s.status IN ('todo', 'in_progress') THEN 1 ELSE 0 END), 0) AS uncompleted_count
      FROM projects p
      LEFT JOIN steps s ON p.id = s.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // On formate les données exactement comme le Frontend l'attend
    const formattedProjects = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      tasks: {
        completed: parseInt(row.completed_count, 10), // parseInt car PostgreSQL renvoie souvent un string pour les SUM/COUNT
        uncompleted: parseInt(row.uncompleted_count, 10),
      },
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

app.get(
  "/api/projects/:id",
  async (req: Request, res: Response): Promise<void> => {
    const rawProjectId = req.params.id;

    if (typeof rawProjectId !== "string") {
      res.status(400).json({ error: "Format d'ID invalide" });
      return;
    }

    const projectId = rawProjectId;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(projectId)) {
      res
        .status(400)
        .json({ error: "L'ID fourni n'est pas un format UUID valide" });
      return;
    }

    try {
      // Récupération du projet
      const projectQuery = `
        SELECT id, name, description, status, created_at 
        FROM projects 
        WHERE id = $1
      `;
      const projectResult = await pool.query(projectQuery, [projectId]);

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable" });
        return;
      }

      const project = projectResult.rows[0];

      // Récupération des étapes liées à ce projet
      const stepsQuery = `
        SELECT id, project_id, number, title, status, note, updated_at 
        FROM steps 
        WHERE project_id = $1 
        ORDER BY number ASC
      `;
      const stepsResult = await pool.query(stepsQuery, [projectId]);

      // Assemblage
      const fullProject = {
        ...project,
        steps: stepsResult.rows,
      };

      res.json(fullProject);
    } catch (error) {
      console.error("Erreur lors de la récupération du projet :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
  await testConnection();
});

// Auth

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Inscription (Register)
app.post(
  "/api/auth/register",
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Tous les champs sont requis" });
      return;
    }

    try {
      // 1. Vérifier si l'utilisateur existe déjà
      const userExists = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (userExists.rows.length > 0) {
        res.status(409).json({ error: "Cet email est déjà utilisé" });
        return;
      }

      // 2. Hacher le mot de passe (le 10 est le "salt rounds", le niveau de complexité)
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 3. Insérer le nouvel utilisateur dans la BDD
      const insertQuery = `
      INSERT INTO users (name, email, password_hash) 
      VALUES ($1, $2, $3) 
      RETURNING id, name, email
    `;
      const newUser = await pool.query(insertQuery, [
        name,
        email,
        passwordHash,
      ]);

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: newUser.rows[0],
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
);

// Connexion (Login)
app.post(
  "/api/auth/login",
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email et mot de passe requis" });
      return;
    }

    try {
      // 1. Chercher l'utilisateur
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
      );
      if (userResult.rows.length === 0) {
        res.status(401).json({ error: "Identifiants incorrects" });
        return;
      }

      const user = userResult.rows[0];

      // 2. Vérifier que le mot de passe correspond au hash enregistré
      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        res.status(401).json({ error: "Identifiants incorrects" });
        return;
      }

      // 3. Générer le Token JWT (valable 7 jours ici)
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      // 4. Renvoyer le token et les infos de base
      res.json({
        message: "Connexion réussie",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
);

// Générer un Token pour le CLI
app.post(
  "/api/auth/cli-token",
  async (req: Request, res: Response): Promise<void> => {
    // 1. On récupère le "badge" (JWT) envoyé par le frontend
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Non autorisé. Connectez-vous d'abord." });
      return;
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
      // 2. On vérifie que le JWT est valide et on lit ce qu'il y a dedans
      const decoded = jwt.verify(jwtToken, JWT_SECRET) as {
        userId: number;
        email: string;
      };
      const userId = decoded.userId;

      // 3. On génère un token CLI ultra-sécurisé (qui commence par "px_" pour Projex)
      const cliToken = "px_" + crypto.randomBytes(24).toString("hex");

      const label =
        req.body.label || "Token généré le " + new Date().toLocaleString();

      // 4. On sauvegarde ce nouveau token dans la base de données
      const insertQuery = `
      INSERT INTO cli_tokens (user_id, token_hash, label) 
      VALUES ($1, $2, $3) 
      RETURNING token_hash, created_at
    `;
      const result = await pool.query(insertQuery, [userId, cliToken, label]);

      res.status(201).json({
        message: "Token CLI généré avec succès",
        cliToken: result.rows[0].token_hash,
        label: result.rows[0].label,
      });
    } catch (error) {
      // Si le JWT est faux ou expiré, ça tombe ici
      console.error("Erreur lors de la génération du token CLI :", error);
      res.status(403).json({ error: "Session invalide ou expirée" });
    }
  },
);

app.get(
  "/api/cli/projects/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    // 1. On récupère le token CLI dans les headers
    const authHeader = req.headers.authorization;
    const projectId = req.params.id;

    // On vérifie que c'est bien un token CLI (qui commence par px_)
    if (!authHeader || !authHeader.startsWith("Bearer px_")) {
      res.status(401).json({ error: "Token CLI manquant ou format invalide." });
      return;
    }

    const cliToken = authHeader.split(" ")[1];

    try {
      // 2. On cherche à qui appartient ce token dans la base de données
      const userQuery = `SELECT user_id FROM cli_tokens WHERE token_hash = $1`;
      const userResult = await pool.query(userQuery, [cliToken]);

      if (userResult.rows.length === 0) {
        res.status(401).json({ error: "Token CLI non reconnu ou révoqué." });
        return;
      }

      const userId = userResult.rows[0].user_id;

      // 3. On récupère le projet (seulement si c'est le sien !)
      const projectQuery = `
      SELECT id, name, status 
      FROM projects 
      WHERE id = $1 AND user_id = $2
    `;
      const projectResult = await pool.query(projectQuery, [projectId, userId]);

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable ou accès refusé." });
        return;
      }

      const project = projectResult.rows[0];

      const stepsQuery = `
        SELECT * 
        FROM steps 
        WHERE project_id = $1 
        ORDER BY number ASC
      `;
      const stepsResult = await pool.query(stepsQuery, [projectId]);

      // On attache les étapes au projet
      project.steps = stepsResult.rows;

      // 4. On renvoie les données complètes au terminal !
      res.json({
        project: project,
      });
    } catch (error) {
      console.error("Erreur lors de la requête CLI status :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },
);

app.post(
  "/api/cli/projects/:id/steps",
  async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const projectId = req.params.id;
    const { title } = req.body;

    // 1. Vérification des données envoyées
    if (!title) {
      res.status(400).json({ error: "Le titre de l'étape est obligatoire." });
      return;
    }

    // 2. Vérification du token CLI
    if (!authHeader || !authHeader.startsWith("Bearer px_")) {
      res.status(401).json({ error: "Token CLI manquant ou format invalide." });
      return;
    }

    const cliToken = authHeader.split(" ")[1];

    try {
      // 3. Authentification du token
      const userResult = await pool.query(
        "SELECT user_id FROM cli_tokens WHERE token_hash = $1",
        [cliToken],
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({ error: "Token CLI non reconnu ou révoqué." });
        return;
      }

      const userId = userResult.rows[0].user_id;

      // 4. Vérifier que le projet appartient à l'utilisateur
      const projectResult = await pool.query(
        "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
        [projectId, userId],
      );

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable ou accès refusé." });
        return;
      }

      // 5. Trouver le numéro de la prochaine étape (le plus grand actuel + 1)
      const maxNumberResult = await pool.query(
        "SELECT COALESCE(MAX(number), 0) as max_number FROM steps WHERE project_id = $1",
        [projectId],
      );
      const nextNumber = parseInt(maxNumberResult.rows[0].max_number) + 1;

      // 6. Insérer la nouvelle étape en base de données
      const insertResult = await pool.query(
        `INSERT INTO steps (project_id, number, title, status)
        VALUES ($1, $2, $3, 'todo')
        RETURNING *`,
        [projectId, nextNumber, title],
      );

      res.status(201).json({ step: insertResult.rows[0] });
    } catch (error) {
      console.error("Erreur lors de la création de l'étape CLI :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },
);

app.post(
  "/api/projects",
  async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Le nom du projet est obligatoire." });
      return;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Non autorisé." });
      return;
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
      // 1. On vérifie qui crée le projet via le JWT
      const decoded = jwt.verify(jwtToken, JWT_SECRET) as { userId: number };
      const userId = decoded.userId;

      // 2. On insère le projet (il sera en statut 'active' par défaut)
      // On génère un UUID automatiquement avec gen_random_uuid()
      const query = `
      INSERT INTO projects (user_id, name, description, status) 
      VALUES ($1, $2, $3, 'active') 
      RETURNING *
    `;
      const result = await pool.query(query, [userId, name, description]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erreur création projet :", error);
      res.status(403).json({ error: "Session invalide." });
    }
  },
);

app.post(
  "/api/projects/:id/steps",
  async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;
    const projectId = req.params.id;
    const { title, note } = req.body;

    if (!title || title.trim() === "") {
      res.status(400).json({ error: "Le titre de l'étape est obligatoire." });
      return;
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Non autorisé." });
      return;
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
      // 1. Vérifier le JWT
      const decoded = jwt.verify(jwtToken, JWT_SECRET) as { userId: number };
      const userId = decoded.userId;
      // 2. Vérifier que le projet appartient à l'utilisateur
      const projectQuery = `
        SELECT id FROM projects WHERE id = $1 AND user_id = $2
      `;
      const projectResult = await pool.query(projectQuery, [projectId, userId]);

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable ou accès refusé." });
        return;
      }

      // 3. Trouver le numéro de la prochaine étape
      const stepNumberQuery = `
        SELECT COALESCE(MAX(number), 0) + 1 AS next_number
        FROM steps
        WHERE project_id = $1
      `;
      const stepNumberResult = await pool.query(stepNumberQuery, [projectId]);
      const nextStepNumber = stepNumberResult.rows[0].next_number;

      // 4. Insérer la nouvelle étape (en statut 'todo' par défaut)
      const insertQuery = `
        INSERT INTO steps (project_id, number, title, status, note)
        VALUES ($1, $2, $3, 'todo', $4)
        RETURNING *
      `;
      const newStepResult = await pool.query(insertQuery, [
        projectId,
        nextStepNumber,
        title,
        note || "",
      ]);
      res.status(201).json(newStepResult.rows[0]);
    } catch (error) {
      console.error("Erreur création étape :", error);
      res.status(403).json({ error: "Session invalide." });
    }
  },
);

app.patch(
  "/api/cli/projects/:id/steps/:number",
  async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization as string | undefined;
    const projectId = req.params.id as string;
    const stepNumber = parseInt(req.params.number as string);
    const status = req.body.status as string;

    // 1. Vérification des données (on s'assure que c'est un bon statut)
    const validStatuses = ["todo", "in_progress", "done", "ignored"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: "Statut invalide ou manquant." });
      return;
    }

    // 2. Vérification du token CLI
    if (!authHeader || !authHeader.startsWith("Bearer px_")) {
      res.status(401).json({ error: "Token CLI manquant ou format invalide." });
      return;
    }

    const cliToken = authHeader.split(" ")[1];

    try {
      // 3. Authentification
      const userResult = await pool.query(
        "SELECT user_id FROM cli_tokens WHERE token_hash = $1",
        [cliToken],
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({ error: "Token CLI non reconnu ou révoqué." });
        return;
      }

      const userId = userResult.rows[0].user_id;

      // 4. Vérifier que le projet appartient bien à l'utilisateur
      const projectResult = await pool.query(
        "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
        [projectId, userId],
      );

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable ou accès refusé." });
        return;
      }

      // 5. Mettre à jour l'étape
      const updateResult = await pool.query(
        `UPDATE steps 
        SET status = $1 
        WHERE project_id = $2 AND number = $3 
        RETURNING *`,
        [status, projectId, stepNumber],
      );

      if (updateResult.rows.length === 0) {
        res.status(404).json({ error: "Étape introuvable pour ce projet." });
        return;
      }

      // 6. Renvoyer l'étape modifiée
      res.json({ step: updateResult.rows[0] });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étape CLI :", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },
);

app.patch(
  "/api/projects/:id/steps/:number",
  async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization as string | undefined;
    const projectId = req.params.id as string;
    const stepNumber = parseInt(req.params.number as string);
    const { title, note, status } = req.body;

    // 1. Vérification du JWT (Interface Web)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Non autorisé." });
      return;
    }

    const jwtToken = authHeader.split(" ")[1];

    try {
      // 2. Décodage du JWT
      const decoded = jwt.verify(jwtToken, JWT_SECRET) as { userId: number };
      const userId = decoded.userId;

      // 3. Vérifier que le projet appartient bien à l'utilisateur
      const projectResult = await pool.query(
        "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
        [projectId, userId],
      );

      if (projectResult.rows.length === 0) {
        res.status(404).json({ error: "Projet introuvable ou accès refusé." });
        return;
      }

      // 4. Mettre à jour l'étape dans la base de données
      const updateResult = await pool.query(
        `UPDATE steps
        SET
        title = COALESCE($1, title),
        note = COALESCE($2, note),
        status = COALESCE($3, status)
        WHERE project_id = $4 AND number = $5
        RETURNING *`,
        [title, note, status, projectId, stepNumber],
      );

      if (updateResult.rows.length === 0) {
        res.status(404).json({ error: "Étape introuvable pour ce projet." });
        return;
      }

      // 5. Renvoyer l'étape modifiée
      res.json({ step: updateResult.rows[0] });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'étape depuis le web :",
        error,
      );
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  },
);

interface UserPayload {
  userId: number;
  email: string;
}

app.get("/api/auth/cli-tokens", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Non autorisé" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserPayload;

    // CORRECTION ICI : Utilise decoded.userId pour matcher ton interface
    const userId = decoded.userId;

    const result = await pool.query(
      'SELECT id, token_hash, label, created_at as "createdAt" FROM cli_tokens WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    res.json({ tokens: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.delete("/api/auth/cli-token/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Non autorisé" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserPayload;
    const userId = decoded.userId;

    const result = await pool.query(
      "DELETE FROM cli_tokens WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Token non trouvé ou non autorisé" });
    }

    res.json({ message: "Token supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});
