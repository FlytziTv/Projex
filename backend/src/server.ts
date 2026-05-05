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
    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.status,
        COUNT(s.id) FILTER (WHERE s.status IN ('done', 'skipped'))::int AS completed_steps,
        COUNT(s.id) FILTER (WHERE s.status IN ('todo', 'in_progress'))::int AS uncompleted_steps
      FROM projects p
      LEFT JOIN steps s ON p.id = s.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `;

    const result = await pool.query(query);

    const formattedProjects = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      status: row.status,
      tasks: {
        completed: row.completed_steps || 0,
        uncompleted: row.uncompleted_steps || 0,
      },
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
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

      // 4. On sauvegarde ce nouveau token dans la base de données
      const insertQuery = `
      INSERT INTO cli_tokens (user_id, token_hash) 
      VALUES ($1, $2) 
      RETURNING token_hash, created_at
    `;
      const result = await pool.query(insertQuery, [userId, cliToken]);

      res.status(201).json({
        message: "Token CLI généré avec succès",
        cliToken: result.rows[0].token_hash,
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
