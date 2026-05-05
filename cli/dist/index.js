#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), ".projex.json");
program
    .name("projex")
    .description(chalk_1.default.blueBright("Le CLI ultime pour gérer tes projets de développement"))
    .version("1.0.0");
// ------------------------------------------------------------------
// COMMANDE: projex hello
// ------------------------------------------------------------------
program
    .command("hello")
    .description("Dit bonjour")
    .action(() => {
    console.log(chalk_1.default.cyan("Salut Alexis ! Le CLI Projex est prêt à l'action."));
});
// ------------------------------------------------------------------
// COMMANDE: projex login <token>
// ------------------------------------------------------------------
program
    .command("login <token>")
    .description("Connecte ton terminal à ton compte Projex via un Personal Access Token")
    .action((token) => {
    try {
        const config = {
            cliToken: token,
        };
        fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log(chalk_1.default.green("Succès : Ton terminal est maintenant connecté à Projex !"));
        console.log(chalk_1.default.gray(`Configuration sauvegardée dans : ${GLOBAL_CONFIG_PATH}`));
    }
    catch (error) {
        console.error(chalk_1.default.red("Erreur lors de la sauvegarde du token :"), error);
    }
});
// ------------------------------------------------------------------
// COMMANDE: projex init <id>
// ------------------------------------------------------------------
program
    .command("init <id>")
    .description("Lie le dossier courant à un projet Projex via son ID (UUID)")
    .action((id) => {
    try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            console.error(chalk_1.default.red("Erreur : L'ID fourni n'est pas un format valide."));
            return;
        }
        const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
        const config = {
            projectId: id,
        };
        fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log(chalk_1.default.green("Succès : Ce dossier est maintenant lié à ton projet Projex !"));
        console.log(chalk_1.default.gray(`Fichier créé : ${LOCAL_CONFIG_PATH}`));
        console.log(chalk_1.default.yellow(`Astuce : N'oublie pas d'ajouter .projex.json à ton .gitignore !`));
    }
    catch (error) {
        console.error(chalk_1.default.red("Erreur lors de l'initialisation du projet :"), error);
    }
});
// ------------------------------------------------------------------
// COMMANDE: projex status
// ------------------------------------------------------------------
program
    .command("status")
    .description("Affiche le statut actuel du projet lié à ce dossier")
    .action(async () => {
    try {
        const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
        // 1. On vérifie si on est bien dans un dossier lié à un projet
        if (!fs.existsSync(LOCAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Aucun projet lié dans ce dossier. Utilise 'projex init <id>' d'abord."));
            return;
        }
        const localConfig = JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
        const projectId = localConfig.projectId;
        // 2. On vérifie si le terminal est bien connecté
        if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Terminal non connecté. Utilise 'projex login <token>' d'abord."));
            return;
        }
        const globalConfig = JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
        const cliToken = globalConfig.cliToken;
        console.log(chalk_1.default.gray("Interrogation de l'API Projex..."));
        // 3. On appelle ton API
        const response = await fetch(`http://localhost:3001/api/cli/projects/${projectId}/status`, {
            headers: {
                Authorization: `Bearer ${cliToken}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(chalk_1.default.red(`Erreur de l'API : ${data.error}`));
            return;
        }
        // 4. On affiche le résultat de manière propre et colorée
        console.log("\n" + chalk_1.default.blueBright.bold("=== STATUT DU PROJET ==="));
        console.log(`${chalk_1.default.bold("Nom :")} ${chalk_1.default.white(data.project.name)}`);
        console.log(`${chalk_1.default.bold("Statut :")} ${chalk_1.default.green(data.project.status)}`);
        console.log(chalk_1.default.blueBright.bold("========================") + "\n");
    }
    catch (error) {
        console.error(chalk_1.default.red("❌ Erreur lors de la récupération du statut :"), error);
    }
});
program.parse(process.argv);
