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

program.parse(process.argv);
