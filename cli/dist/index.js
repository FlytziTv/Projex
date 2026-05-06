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
program
    .command("status")
    .description("Affiche le statut actuel du projet lié à ce dossier")
    .action(async () => {
    try {
        const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
        if (!fs.existsSync(LOCAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Aucun projet lié dans ce dossier. Utilise 'projex init <id>' d'abord."));
            return;
        }
        const localConfig = JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
        const projectId = localConfig.projectId;
        if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Terminal non connecté. Utilise 'projex login <token>' d'abord."));
            return;
        }
        const globalConfig = JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
        const cliToken = globalConfig.cliToken;
        console.log(chalk_1.default.gray("Interrogation de l'API Projex..."));
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
        const project = data.project || data;
        console.log("\n" + chalk_1.default.blueBright.bold("=== STATUT DU PROJET ==="));
        console.log(`${chalk_1.default.bold("Nom :")} ${chalk_1.default.white(project.name)}`);
        console.log(`${chalk_1.default.bold("Statut :")} ${chalk_1.default.green(project.status)}`);
        const steps = project.steps || data.steps || [];
        const totalSteps = steps.length;
        // 2. On remplace (s: any) par (s: Step)
        const completedSteps = steps.filter((s) => s.status === "completed" || s.status === "done").length;
        if (totalSteps > 0) {
            const percentage = Math.round((completedSteps / totalSteps) * 100);
            console.log(`\nProgression ${percentage}% (${completedSteps}/${totalSteps})`);
            console.log(`\nÉtapes :`);
            // 3. On remplace (step: any) par (step: Step)
            steps.forEach((step) => {
                let statusIcon = "⏳";
                if (step.status === "completed" || step.status === "done")
                    statusIcon = "✅";
                if (step.status === "in_progress" || step.status === "active")
                    statusIcon = "🚀";
                if (step.status === "ignored")
                    statusIcon = "❌";
                console.log(`${statusIcon} [STP-${step.number}] ${chalk_1.default.white(step.title)}`);
            });
        }
        else {
            console.log(chalk_1.default.gray(`\nProgression : Aucune étape pour le moment.`));
        }
        console.log(chalk_1.default.blueBright.bold("========================") + "\n");
    }
    catch (error) {
        console.error(chalk_1.default.red("Erreur lors de la récupération du statut :"), error);
    }
});
program
    .command("step:add <title...>")
    .description("Ajoute une nouvelle étape au projet actuel")
    .action(async (titleArray) => {
    try {
        const title = titleArray.join(" ");
        const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
        if (!fs.existsSync(LOCAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Aucun projet lié dans ce dossier. Utilise 'projex init <id>' d'abord."));
            return;
        }
        const localConfig = JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
        const projectId = localConfig.projectId;
        if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Terminal non connecté. Utilise 'projex login <token>' d'abord."));
            return;
        }
        const globalConfig = JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
        const cliToken = globalConfig.cliToken;
        console.log(chalk_1.default.gray(`Création de l'étape "${title}"...`));
        const response = await fetch(`http://localhost:3001/api/cli/projects/${projectId}/steps`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cliToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }), // On envoie le titre dans le body
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(chalk_1.default.red(`Erreur de l'API : ${data.error}`));
            return;
        }
        console.log(chalk_1.default.green(`\nÉtape ajoutée avec succès !`));
        console.log(`[STP-${data.step.number}] ${chalk_1.default.white(data.step.title)}`);
        console.log(chalk_1.default.gray(`\nAstuce : Tape 'projex status' pour voir ta barre de progression.`));
    }
    catch (error) {
        console.error(chalk_1.default.red("Erreur lors de l'ajout de l'étape :"), error);
    }
});
async function updateStepStatus(number, status) {
    try {
        const LOCAL_CONFIG_PATH = path.join(process.cwd(), ".projex.json");
        if (!fs.existsSync(LOCAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Aucun projet lié dans ce dossier. Utilise 'projex init <id>' d'abord."));
            return;
        }
        const localConfig = JSON.parse(fs.readFileSync(LOCAL_CONFIG_PATH, "utf-8"));
        const projectId = localConfig.projectId;
        if (!fs.existsSync(GLOBAL_CONFIG_PATH)) {
            console.log(chalk_1.default.yellow("Terminal non connecté. Utilise 'projex login <token>' d'abord."));
            return;
        }
        const globalConfig = JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, "utf-8"));
        const cliToken = globalConfig.cliToken;
        console.log(chalk_1.default.gray(`Mise à jour de l'étape STP-${number}...`));
        // On appelle la route PATCH de l'API
        const response = await fetch(`http://localhost:3001/api/cli/projects/${projectId}/steps/${number}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${cliToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });
        const data = await response.json();
        if (!response.ok) {
            console.error(chalk_1.default.red(`Erreur de l'API : ${data.error}`));
            return;
        }
        const statusText = status === "done"
            ? chalk_1.default.green("Terminée")
            : chalk_1.default.blueBright(" En cours");
        console.log(`\nÉtape STP-${number} passée en statut : ${statusText}`);
    }
    catch (error) {
        console.error(chalk_1.default.red("Erreur lors de la mise à jour de l'étape :"), error);
    }
}
// ------------------------------------------------------------------
// COMMANDE: projex step:start <number>
// ------------------------------------------------------------------
program
    .command("step:start <number>")
    .description("Passe une étape en statut 'en cours' (in_progress)")
    .action((number) => updateStepStatus(number, "in_progress"));
// ------------------------------------------------------------------
// COMMANDE: projex step:done <number>
// ------------------------------------------------------------------
program
    .command("step:done <number>")
    .description("Marque une étape comme terminée (done)")
    .action((number) => updateStepStatus(number, "done"));
program.parse(process.argv);
