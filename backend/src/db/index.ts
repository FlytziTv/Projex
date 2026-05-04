import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// On vérifie que la variable d'environnement existe bien
if (!process.env.DATABASE_URL) {
  throw new Error(
    "La variable DATABASE_URL est manquante dans le fichier .env",
  );
}

// Le Pool gère automatiquement plusieurs connexions simultanées à la BDD.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon exige une connexion sécurisée (SSL)
  ssl: {
    rejectUnauthorized: false,
  },
});

// Vérifier que la connexion fonctionne au démarrage
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Connecté avec succès à NeonDB !");

    const res = await client.query("SELECT NOW()");
    console.log("Heure du serveur BDD :", res.rows[0].now);

    client.release();
  } catch (err) {
    console.error("Erreur de connexion à NeonDB :", err);
  }
}
