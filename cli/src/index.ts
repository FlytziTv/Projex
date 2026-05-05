#!/usr/bin/env node

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import chalk from "chalk";

const program = new Command();

const GLOBAL_CONFIG_PATH = path.join(os.homedir(), ".projex.json");

program
  .name("projex")
  .description(
    chalk.blueBright("Le CLI ultime pour gérer tes projets de développement"),
  )
  .version("1.0.0");

// ------------------------------------------------------------------
// COMMANDE: projex hello
// ------------------------------------------------------------------
program
  .command("hello")
  .description("Dit bonjour")
  .action(() => {
    console.log(
      chalk.cyan("Salut Alexis ! Le CLI Projex est prêt à l'action."),
    );
  });

// ------------------------------------------------------------------
// COMMANDE: projex login <token>
// ------------------------------------------------------------------
program
  .command("login <token>")
  .description(
    "Connecte ton terminal à ton compte Projex via un Personal Access Token",
  )
  .action((token: string) => {
    try {
      const config = {
        cliToken: token,
      };

      fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(config, null, 2));

      console.log(
        chalk.green("Succès : Ton terminal est maintenant connecté à Projex !"),
      );
      console.log(
        chalk.gray(`Configuration sauvegardée dans : ${GLOBAL_CONFIG_PATH}`),
      );
    } catch (error) {
      console.error(
        chalk.red("Erreur lors de la sauvegarde du token :"),
        error,
      );
    }
  });

// ------------------------------------------------------------------
// COMMANDE: projex init <id>
// ------------------------------------------------------------------
program
  .command("init <id>")
  .description("Lie le dossier courant à un projet Projex via son ID (UUID)")
  .action((id: string) => {
    try {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(id)) {
        console.error(
          chalk.red("Erreur : L'ID fourni n'est pas un format valide."),
        );
        return;
      }

      const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");

      const config = {
        projectId: id,
      };

      fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(config, null, 2));

      console.log(
        chalk.green(
          "Succès : Ce dossier est maintenant lié à ton projet Projex !",
        ),
      );
      console.log(chalk.gray(`Fichier créé : ${LOCAL_CONFIG_PATH}`));

      console.log(
        chalk.yellow(
          `Astuce : N'oublie pas d'ajouter .projex.json à ton .gitignore !`,
        ),
      );
    } catch (error) {
      console.error(
        chalk.red("Erreur lors de l'initialisation du projet :"),
        error,
      );
    }
  });

// ------------------------------------------------------------------
// COMMANDE: projex status
// ------------------------------------------------------------------

interface Step {
  number: number;
  title: string;
  status: string;
}

program
  .command("status")
  .description("Affiche le statut actuel du projet lié à ce dossier")
  .action(async () => {
    try {
      const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
      if (!fs.existsSync(LOCAL_CONFIG_PATH)) {
        console.log(
          chalk.yellow(
            "Aucun projet lié dans ce dossier. Utilise 'projex init <id>' d'abord.",
          ),
        );
        return;
      }

      const localConfig = JSON.parse(
        fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"),
      );
      const projectId = localConfig.projectId;

      if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
        console.log(
          chalk.yellow(
            "Terminal non connecté. Utilise 'projex login <token>' d'abord.",
          ),
        );
        return;
      }

      const globalConfig = JSON.parse(
        fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"),
      );
      const cliToken = globalConfig.cliToken;

      console.log(chalk.gray("Interrogation de l'API Projex..."));

      const response = await fetch(
        `http://localhost:3001/api/cli/projects/${projectId}/status`,
        {
          headers: {
            Authorization: `Bearer ${cliToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(chalk.red(`Erreur de l'API : ${data.error}`));
        return;
      }

      const project = data.project || data;

      console.log("\n" + chalk.blueBright.bold("=== STATUT DU PROJET ==="));
      console.log(`${chalk.bold("Nom :")} ${chalk.white(project.name)}`);
      console.log(`${chalk.bold("Statut :")} ${chalk.green(project.status)}`);

      const steps = project.steps || data.steps || [];
      const totalSteps = steps.length;

      // 2. On remplace (s: any) par (s: Step)
      const completedSteps = steps.filter(
        (s: Step) => s.status === "completed" || s.status === "done",
      ).length;

      if (totalSteps > 0) {
        const percentage = Math.round((completedSteps / totalSteps) * 100);

        console.log(
          `\nProgression ${percentage}% (${completedSteps}/${totalSteps})`,
        );
        console.log(`\nÉtapes :`);

        // 3. On remplace (step: any) par (step: Step)
        steps.forEach((step: Step) => {
          let statusIcon = "⏳";
          if (step.status === "completed" || step.status === "done")
            statusIcon = "✅";
          if (step.status === "in_progress" || step.status === "active")
            statusIcon = "🚀";
          if (step.status === "ignored") statusIcon = "❌";

          console.log(
            `${statusIcon} [STP-${step.number}] ${chalk.white(step.title)}`,
          );
        });
      } else {
        console.log(chalk.gray(`\nProgression : Aucune étape pour le moment.`));
      }

      console.log(chalk.blueBright.bold("========================") + "\n");
    } catch (error) {
      console.error(
        chalk.red("Erreur lors de la récupération du statut :"),
        error,
      );
    }
  });

program.parse(process.argv);
