# Projex — User Guide

> **Manage your projects from anywhere.** Projex unifies your development workflow: a beautiful web dashboard for overview, a powerful CLI for your terminal. Your project state syncs seamlessly between both.

---

## Table of Contents

1. [What is Projex?](#what-is-projex)
2. [Quick Start (Web)](#quick-start-web)
3. [Understanding Your Dashboard](#understanding-your-dashboard)
4. [Using the Kanban Board](#using-the-kanban-board)
5. [The CLI Bridge](#the-cli-bridge)
6. [CLI Commands Reference](#cli-commands-reference)
7. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## What is Projex?

Projex is a project management tool built for developers who live in the terminal. Instead of switching contexts, you get:

- **Web Dashboard**: Visual overview of all projects, progress tracking, and task management
- **Terminal CLI**: Add tasks, update progress, check status—without leaving your editor
- **Real-time Sync**: Changes in the terminal instantly appear on the web, and vice versa

Whether you prefer clicking in a browser or typing commands, Projex keeps your workflow unified.

### Why Projex?

✓ **One source of truth** — Dashboard and CLI always synchronized  
✓ **Terminal-native** — Full control without touching your mouse  
✓ **Visual feedback** — See progress at a glance on the web  
✓ **Simple statuses** — Todo → In Progress → Done (or Skipped)  
✓ **No friction** — Works exactly like your development workflow

---

## Quick Start (Web)

### Step 1: Create Your First Project

On the **Dashboard** (home page):

1. Click the **"New Project"** button (top-right)
2. Enter:
   - **Project Name** (e.g., "Build E-Commerce Platform")
   - **Description** (optional, e.g., "Online store with payments")
3. Click **"Create"**

Your project now appears as a card on the dashboard.

### Step 2: Add Your First Task

On your project card, click **"View"** to open the project detail page.

You'll see a **Kanban board** with 4 columns. To add a task:

1. Look for the **"+ Add Step"** button (top-right area)
2. Enter a task name: _"Set up database schema"_
3. Click **"Add"**

The task appears in the **"À faire"** (Todo) column.

### Step 3: Check Your Progress

At the top of the project page, you'll see a **progress bar**:

```
Progression (1/1)
████░░░░░░ 100%
```

This shows: **Completed / Total** tasks and the percentage.

---

## Understanding Your Dashboard

The dashboard is your project overview. Each project card shows:

### What's on Each Card?

```
┌─────────────────────────────────────┐
│  My E-Commerce Platform             │  ← Project Name
│  Build online store with payments   │  ← Description
│                                     │
│  Status: 🟢 Active                  │  ← Project Status
│  Progression: ████░░░░░░ 65%        │  ← Progress Bar
│  (13/20)                            │  ← Completed/Total
│                                     │
│  [View] [Copy ID] [⋯]              │  ← Actions
└─────────────────────────────────────┘
```

### Progress Calculation

The progress bar shows: **How many tasks are done?**

```
Progress % = (Done Tasks + Skipped Tasks) / Total Tasks × 100
```

**Example:**

- Total tasks: 20
- Done tasks: 11
- Skipped tasks: 2
- **Progress: (11 + 2) / 20 × 100 = 65%**

**Note:** Only `done` and `skipped` count as completed. `todo` and `in_progress` tasks don't advance the bar.

### Project Status Indicator

Each card shows a colored status badge:

| Status    | Color     | Meaning                         |
| --------- | --------- | ------------------------------- |
| Active    | 🟢 Green  | You're actively working on this |
| Paused    | 🟡 Yellow | Temporarily stopped             |
| Completed | 🟢 Green  | Finished successfully           |
| Abandoned | 🔴 Red    | No longer pursuing              |
| Future    | 🔵 Blue   | Planned but not started         |

---

## Using the Kanban Board

Click **"View"** on any project card to open its Kanban board.

### The Four Columns

Your tasks are organized into four columns:

#### 1. **À faire** (Todo)

- Tasks that haven't been started
- New tasks you just added appear here
- **Drag tasks here** to mark them as pending

#### 2. **En cours** (In Progress)

- Tasks you're currently working on
- This column is highlighted to show active work
- **Drag tasks here** when you start them

#### 3. **Terminé** (Done)

- Tasks you've completed successfully
- These count toward your progress bar
- **Drag tasks here** when finished

#### 4. **Ignoré** (Skipped)

- Tasks you've decided NOT to implement
- Still counts toward completion (you made the decision)
- **Drag tasks here** for tasks that won't be done

### Editing a Task

Each task card has a **pen icon** (✏️) in the top-right corner. Click it to open the **Edit Modal**:

```
┌──────────────────────────────────┐
│  Edit Step                    [✕] │
├──────────────────────────────────┤
│                                  │
│  Title                           │
│  [Set up database schema      ] │
│                                  │
│  Status                          │
│  [ In Progress ▼ ]              │
│                                  │
│  [Cancel]              [Save]   │
└──────────────────────────────────┘
```

In the modal, you can:

1. **Change the title** — Update what the task is about
2. **Change the status** — Select from: Todo, In Progress, Done, Skipped
3. **Save** — Changes sync immediately to the CLI and dashboard

### Drag & Drop

You can also **drag tasks between columns** to quickly update their status:

```
Todo  ──drag──▶  In Progress  ──drag──▶  Done
```

Dragging automatically updates the task status and recalculates your progress bar.

---

## The CLI Bridge

The CLI is where the real power lives. Use it to manage your projects **without switching out of your editor**.

### Why Use the CLI?

- ⚡ **Faster** — Type `projex status` instead of opening a browser
- 🔄 **Synced** — Your web dashboard updates instantly
- 🛠️ **Workflow-friendly** — Works inside your terminal/IDE
- 📊 **Real-time** — See progress right where you code

### Getting Started with the CLI

#### Step 1: Generate Your CLI Token

1. Log in to the web dashboard
2. Go to **Settings** (top-right menu) → **Profile**
3. Scroll to **"CLI Token"**
4. Click **"Generate Token"**
5. You'll see a token like: `px_a1b2c3d4e5f6g7h8i9j0...`
6. **Copy this token** (you'll only see it once!)

#### Step 2: Authenticate Your Terminal

In your terminal, run:

```bash
projex login px_a1b2c3d4e5f6g7h8i9j0...
```

**Output:**

```
✓ Succès : Ton terminal est maintenant connecté à Projex !
Configuration sauvegardée dans : ~/.projex.json
```

This stores your token globally. You only need to do this once.

#### Step 3: Link Your Project Folder

Navigate to your project folder in the terminal:

```bash
cd ~/my-ecommerce-project
```

Get your **Project ID** from the web dashboard:

1. Click on your project card
2. Look for the **"Copy ID"** button (top-right)
3. Click it to copy the UUID

Then link it:

```bash
projex init <project_id>
```

**Example:**

```bash
projex init 123e4567-e89b-12d3-a456-426614174000
```

**Output:**

```
✓ Succès : Ce dossier est maintenant lié à ton projet Projex !
Fichier créé : .projex.json

⚠️ Astuce : N'oublie pas d'ajouter .projex.json à ton .gitignore !
```

**Important:** Add `.projex.json` to your `.gitignore` file:

```bash
echo ".projex.json" >> .gitignore
```

---

## CLI Commands Reference

### `projex status`

**See your project progress in the terminal.**

```bash
projex status
```

**Output:**

```
=== STATUT DU PROJET ===
Nom: Build E-Commerce Platform
Statut: active

Progression 65% (13/20)

Étapes:
✅ [STP-1] Setup database
✅ [STP-2] Implement auth
✅ [STP-3] Create dashboard
🚀 [STP-4] Add payment gateway
⏳ [STP-5] Write tests
⏳ [STP-6] Deploy to staging
❌ [STP-7] Mobile app (decided not to do)
========================
```

**What the icons mean:**

- ✅ = Done
- 🚀 = In Progress
- ⏳ = Todo
- ❌ = Skipped

**Use it for:** Quick visual check of what you're working on

---

### `projex step:add "<title>"`

**Add a new task without leaving your IDE.**

```bash
projex step:add "Implement email notifications"
```

**Output:**

```
Création de l'étape "Implement email notifications"...

Étape ajoutée avec succès !
[STP-8] Implement email notifications

Astuce : Tape 'projex status' pour voir ta barre de progression.
```

The new task:

- Appears immediately in the **"À faire"** (Todo) column on the web dashboard
- Gets a unique number (STP-8 in this example)
- Contributes to your total task count

**Tips:**

- Use quotes for multi-word titles
- Tasks always start in "Todo" status
- You can add multiple tasks in a row

---

### `projex step:start <number>`

**Mark a task as "In Progress".**

```bash
projex step:start 4
```

**Output:**

```
Mise à jour de l'étape STP-4...

Étape STP-4 passée en statut :  En cours
```

**What happens:**

- Task moves to the **"En cours"** column on the dashboard
- Progress bar does NOT advance (in-progress tasks don't count)
- Syncs instantly to the web dashboard

---

### `projex step:done <number>`

**Mark a task as completed.**

```bash
projex step:done 4
```

**Output:**

```
Mise à jour de l'étape STP-4...

Étape STP-4 passée en statut : Terminée
```

**What happens:**

- Task moves to the **"Terminé"** (Done) column on the dashboard
- Progress bar advances (done tasks count toward completion)
- Web dashboard updates in real-time
- You get that dopamine hit of progress! ✨

---

## FAQ & Troubleshooting

### General Questions

#### Q: How do I skip a task?

**A:** Use the edit modal on the web dashboard:

1. Click the task's pen icon (✏️)
2. Change the status to **"Ignoré"** (Skipped)
3. Click **"Save"**

Skipped tasks count as completed (you made a decision about them), so your progress bar advances.

#### Q: Can I see all tasks across all projects in the CLI?

**A:** Not yet. The CLI shows the status of the **current project folder** (the one with `.projex.json`). To check a different project, `cd` to that folder.

```bash
cd ~/project-1
projex status

cd ~/project-2
projex status
```

#### Q: What if I accidentally mark a task as "Done"?

**A:** No problem! Use the edit modal to change it back:

1. On the web dashboard, click the task's pen icon (✏️)
2. Change the status back to the correct one
3. Click **"Save"**

#### Q: Can I use the CLI offline?

**A:** No. The CLI connects to the web API to sync your changes. You need an internet connection.

---

### Errors & How to Fix Them

#### ❌ "Aucun projet lié dans ce dossier"

**Translation:** "No project linked in this folder"

**Cause:** You haven't run `projex init` yet, or you're in the wrong folder.

**Fix:**

```bash
# Get your project ID from the web dashboard (Copy ID button)
projex init <project_id>
```

---

#### ❌ "Terminal non connecté"

**Translation:** "Terminal not connected"

**Cause:** You haven't logged in with `projex login` yet, or your token expired.

**Fix:**

1. Go to web dashboard → Settings → Profile
2. Generate a new CLI token
3. Run:
   ```bash
   projex login <new_token>
   ```

---

#### ❌ "JWT Malformed"

**Cause:** Your token is corrupted, invalid, or expired.

**What is a JWT?** It's a security token that proves you're authorized. "Malformed" means it's in the wrong format or has been modified.

**Fix:**

1. Go to web dashboard → Settings → Profile
2. Delete the old CLI token
3. Click **"Generate Token"** again
4. Copy the new token and run:
   ```bash
   projex login <new_token>
   ```

---

#### ❌ "Erreur 500" from the API

**Cause:** Something went wrong on the server side (not your fault).

**Fix:**

1. Wait a few seconds and try again
2. Check if your internet connection is working
3. Try a different command (e.g., `projex status`)
4. If it persists, the server might be down

---

#### ❌ "Cannot connect to API"

**Cause:** The web server isn't running, or you're offline.

**Fix:**

1. Make sure you're connected to the internet
2. Check if the web dashboard works (http://localhost:3000)
3. Verify the API URL is correct in your environment

---

### Understanding Task Statuses

#### What's the difference between "Done" and "Skipped"?

| Status                     | Meaning                 | Progress Impact | Use Case                                     |
| -------------------------- | ----------------------- | --------------- | -------------------------------------------- |
| **Todo** (À faire)         | Task hasn't started     | No              | New tasks, backlog items                     |
| **In Progress** (En cours) | Currently working on it | No              | Active work                                  |
| **Done** (Terminé)         | Completed successfully  | **Yes** (+1)    | Feature is built and working                 |
| **Skipped** (Ignoré)       | Decided NOT to do it    | **Yes** (+1)    | Won't implement, out of scope, deprioritized |

**Example:**

```
You have 10 tasks total.
- 7 are marked "Done" ✅
- 2 are marked "Skipped" ❌ (you decided not to do them)
- 1 is "In Progress" 🚀
- 0 are "Todo" ⏳

Progress = (7 + 2) / 10 = 90%
```

Both done and skipped tasks count toward completion because they represent **decisions** — you decided the task is either finished or won't happen.

---

#### "In Progress" vs. "Todo"

- **Todo**: You haven't started yet
- **In Progress**: You're actively working on it right now

Moving a task to "In Progress" doesn't advance your progress bar, because the work isn't finished yet. Progress only advances when you mark it **Done** or **Skipped**.

---

### Token & Security Questions

#### Q: What should I do with my CLI token?

**A:**

- ✅ Keep it safe (like a password)
- ✅ Store it in `~/.projex.json` (auto-generated by `projex login`)
- ✅ Add `.projex.json` to `.gitignore`
- ❌ Never commit `.projex.json` to Git
- ❌ Never share your token with others
- ❌ Never paste it in chat, emails, or public places

#### Q: Can I have multiple CLI tokens?

**A:** Yes, but only one per device. If you generate a new token, the old one becomes invalid. This is good for security — if someone gets your old token, just generate a new one.

#### Q: What happens if someone gets my CLI token?

**A:** They can add tasks and update project progress. To fix it:

1. Go to web dashboard → Settings → Profile
2. Delete the compromised token
3. Generate a new one
4. Run `projex login <new_token>`

---

### Workflow Tips

#### Tip 1: Link Multiple Projects

```bash
cd ~/project-1
projex init <project-1-id>

cd ~/project-2
projex init <project-2-id>
```

Each project folder has its own `.projex.json`. Switch projects by changing directories.

#### Tip 2: Quick Status Check

```bash
alias pxs="projex status"
pxs  # Shorter command
```

#### Tip 3: Batch Add Tasks

```bash
projex step:add "Setup ESLint"
projex step:add "Setup Prettier"
projex step:add "Create CI pipeline"
projex step:add "Deploy to staging"
```

Add multiple tasks in one session, then check progress:

```bash
projex status
```

#### Tip 4: Start Your Day

```bash
projex status  # See what you worked on yesterday
projex step:start 5  # Start today's first task
```

#### Tip 5: End Your Day

```bash
projex status  # Review what you completed
# You'll see your progress bar increase! ✨
```

---

### Dashboard Tips

#### Copy Project ID Easily

Every project has a **"Copy ID"** button in the top-right corner of its detail view. Click it to copy the UUID to your clipboard, then paste in the CLI:

```bash
projex init <paste here>
```

#### Bookmark Your Projects

Bookmark the project detail page for quick access:

```
http://localhost:3000/detail-project/<project-id>
```

#### Drag Tasks to Rearrange

In the Kanban board, you can drag tasks between columns to quickly update their status. No clicking required!

---

### Performance Questions

#### Q: Is the CLI slow?

**A:** Should be instant (< 1 second). If it's slow:

- Check your internet connection
- Try again (might be a temporary hiccup)
- Verify the web dashboard is running

#### Q: Do tasks sync immediately?

**A:** Yes! When you run `projex step:done 4`, the web dashboard updates instantly.

---

## Glossary

#### **Project**

A top-level organizational unit. Contains multiple tasks. Examples: "Build E-Commerce Platform", "Redesign Homepage".

#### **Step** (or Task)

An individual work item within a project. Identified by number (STP-1, STP-2, etc.).

#### **Status**

The current state of a task: Todo, In Progress, Done, or Skipped.

#### **Progress Bar**

Visual indicator showing (Done + Skipped) / Total × 100%.

#### **CLI**

Command-Line Interface. The terminal tool for managing projects without a GUI.

#### **Kanban Board**

Visual board with four columns showing task status. Allows drag-and-drop organization.

#### **CLI Token**

Security credential (format: `px_...`) that authenticates your terminal to the web dashboard. Generated in Settings → Profile.

#### **JWT**

JSON Web Token. A secure token format used for authentication. "Malformed" means it's invalid or corrupted.

#### **Sync**

Real-time updates between web dashboard and CLI. Change a task in the terminal, see it update on the web instantly.

---

## Getting Help

**Something not working?**

1. Check the **FAQ & Troubleshooting** section above
2. Try running `projex hello` to verify the CLI is installed
3. Verify you're logged in: Check `~/.projex.json` exists
4. Verify your project is linked: Check `.projex.json` exists in your project folder

**Still stuck?**

- Regenerate your CLI token (Settings → Profile)
- Try logging in again: `projex login <new-token>`
- Restart your terminal
- Refresh the web dashboard (F5)

---

**Projex v1.0.0** — Built for developers, by developers.

Last updated: 2026-05-06
