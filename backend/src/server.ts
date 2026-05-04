import express, { Request, Response } from "express";
import cors from "cors";
import { pool, testConnection } from "./db";

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
