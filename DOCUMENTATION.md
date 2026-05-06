# Projex Documentation

> A seamless project management tool that syncs between a modern web interface and a powerful CLI, keeping your workflow in the terminal and your overview on screen.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Getting Started](#getting-started)
3. [Web Interface Guide](#web-interface-guide)
4. [CLI Reference](#cli-reference)
5. [Security](#security)
6. [Troubleshooting](#troubleshooting)
7. [Glossary](#glossary)

---

## Architecture Overview

Projex is a full-stack project management solution designed for developers who want to manage projects efficiently without leaving the terminal. The system maintains synchronized state between two interfaces:

- **Web Dashboard** (Next.js 16, React 19, Tailwind CSS v4): Visual overview of projects and tasks
- **CLI Tool** (Node.js, TypeScript, Commander.js): Terminal-based project management
- **Backend API** (Express.js): REST API handling synchronization
- **Database** (PostgreSQL): Persistent storage with SQL vanilla queries

### How It Works

The system operates on a simple synchronization model:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Terminal  │         │  Express API │         │  Web Dashboard  │
│   (CLI)     │────────▶│  (REST)      │◀────────│  (Next.js)      │
└─────────────┘         └──────────────┘         └─────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  PostgreSQL DB   │
                     └──────────────────┘
```

1. **CLI Command** → HTTP request to Express API
2. **API** → Database update + response
3. **Web Dashboard** → Fetches fresh data on load (no-store cache)
4. **Real-time Updates** → React re-renders with latest project state

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 19, TypeScript | Web dashboard UI |
| Styling | Tailwind CSS v4 | Component styling |
| Backend | Express.js, TypeScript | REST API endpoints |
| Authentication | JWT (Bearer tokens) | CLI and web auth |
| Database | PostgreSQL, vanilla SQL | Data persistence |
| CLI | Node.js, Commander.js | Terminal commands |
| Package Manager | npm workspaces | Monorepo management |

---

## Getting Started

### Installation (Development)

#### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+

#### Setup Steps

```bash
# Clone the repository
git clone <repo-url>
cd projex

# Install all dependencies
npm install

# Configure environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Create the database schema
psql -U postgres -f apps/api/sql/schema.sql

# Start all services in parallel
npm run dev
```

#### Environment Variables

**Backend** (`apps/api/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/projex
JWT_SECRET=your_secret_key_here
PORT=3001
```

**Frontend** (`apps/web/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Verification

After setup, verify all services are running:
- **Web Dashboard**: http://localhost:3000
- **API Server**: http://localhost:3001/api
- **CLI**: Available as `projex` command after global install

---

## Web Interface Guide

### Dashboard Overview (Home Page)

The dashboard displays all your projects in an organized card layout. Each card shows:

- **Project Name**: Title of the project
- **Project Status**: Visual indicator (active, paused, completed, abandoned, future)
- **Progress Bar**: Visual representation of completion
- **Task Count**: `Completed / Total` tasks in the format `(N/M)`
- **Quick Actions**: Access to detailed view

#### Progress Calculation

The progress bar is calculated as follows:

```
Progress % = (Completed Steps / Total Steps) × 100
```

Where **Completed Steps** includes both `done` and `skipped` statuses.

Example:
- Total steps: 10
- Completed (done + skipped): 7
- Progress: 70%

### Kanban Board View (Project Detail)

Click on any project card to access the Kanban board. This view provides a detailed overview of all tasks organized by status.

#### The Four Columns

The Kanban board consists of four columns:

1. **À faire** (Todo)
   - Newly created tasks that haven't been started
   - Drag tasks here to keep them pending

2. **En cours** (In Progress)
   - Active tasks currently being worked on
   - Visual indicator shows this column is active
   - Tasks here contribute to "active work" metrics

3. **Terminé** (Done)
   - Completed tasks that are finished
   - Counts toward project progress
   - Cannot be edited in this state

4. **Ignoré** (Skipped)
   - Tasks marked as skipped or not applicable
   - Also counts toward project completion
   - Useful for documenting decisions to not implement features

#### Step Management

Each step card displays:
- **Step Number**: Unique identifier (STP-1, STP-2, etc.)
- **Title**: Brief description of the task
- **Edit Button**: Pen icon (✎) to modify the step
- **Current Status**: Visual indicator of status

#### Edit Step Modal

Click the **pen icon** (✎) on any step to open the edit modal:

1. **Edit Title**: Modify the step's description
2. **Change Status**: Update to any of the four statuses via dropdown
3. **Notes/Details**: Add additional context (if available)
4. **Live Status Update**: Changes are synchronized immediately to all connected clients
5. **JWT Authentication**: All updates are verified with your auth token

The edit modal provides real-time feedback and prevents duplicate submissions.

### Project Detail Header

At the top of each project view:

- **Back Button**: Return to dashboard
- **Project Title**: Name of the current project
- **Status Badge**: Animated indicator with project state
- **Description**: Project overview
- **Progress Section**: Shows percentage and completion ratio

### Action Bar

Located in the top-right corner of project view:

| Action | Icon | Purpose |
|--------|------|---------|
| Add Step | + | Create new task in project |
| Copy ID | 📋 | Copy project ID to clipboard |
| Documentation | 📖 | Open help documentation |
| More | ⋯ | Additional project options |

---

## CLI Reference

The CLI tool provides terminal-based project management. All commands read configuration from local and global config files.

### Initial Setup

#### Step 1: Global Login

Store your CLI token globally (done once):

```bash
projex login <your_cli_token>
```

This creates `~/.projex.json` with:
```json
{
  "cliToken": "your_token_here"
}
```

#### Step 2: Initialize Project

In any project folder:

```bash
projex init <project_id>
```

This creates `.projex.json` locally:
```json
{
  "projectId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Important**: Add `.projex.json` to `.gitignore` — it contains sensitive auth tokens.

### Commands

#### `projex hello`

Test if the CLI is properly installed.

```bash
projex hello
```

**Output**:
```
Salut Alexis ! Le CLI Projex est prêt à l'action.
```

#### `projex status`

Display current project statistics and progress.

```bash
projex status
```

**Output**:
```
=== STATUT DU PROJET ===
Nom: Mon Projet
Statut: active

Progression 70% (7/10)

Étapes:
✅ [STP-1] Setup database
🚀 [STP-2] Implement auth
⏳ [STP-3] Create dashboard
❌ [STP-4] Write tests
...
========================
```

**Status Icons**:
- ✅ Done/Completed
- 🚀 In Progress/Active
- ⏳ Todo/Pending
- ❌ Skipped/Ignored

**Requirements**:
- Must run in a directory with `.projex.json`
- Global config (from `projex login`) must exist

#### `projex step:add "<title>"`

Add a new task to the backlog (status = todo).

```bash
projex step:add "Implement user authentication"
projex step:add "Write unit tests for API"
```

**Output**:
```
Création de l'étape "Implement user authentication"...

Étape ajoutée avec succès !
[STP-11] Implement user authentication

Astuce : Tape 'projex status' pour voir ta barre de progression.
```

**Notes**:
- Multi-word titles must be quoted
- New steps always start in `todo` status
- Appears immediately in web dashboard
- Returns the new step number for reference

#### `projex step:start <number>`

Move a step to `in_progress` status.

```bash
projex step:start 3
projex step:start 5
```

**Output**:
```
Mise à jour de l'étape STP-3...

Étape STP-3 passée en statut :  En cours
```

**API Call**: PATCH `/api/cli/projects/{projectId}/steps/{number}`

#### `projex step:done <number>`

Mark a step as `done` (completed).

```bash
projex step:done 3
```

**Output**:
```
Mise à jour de l'étape STP-3...

Étape STP-3 passée en statut : Terminée
```

**Effect**:
- Step moves to "Terminé" column in Kanban
- Counts toward project progress percentage
- Progress bar updates on web dashboard

### Configuration Files

#### Global Config: `~/.projex.json`

Stores authentication token (created by `projex login`):

```json
{
  "cliToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Location**: User's home directory
**Scope**: Applies to all projects on this machine
**Permissions**: Should be restricted (mode 600 recommended)

#### Local Config: `.projex.json`

Stores project binding (created by `projex init`):

```json
{
  "projectId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Location**: Project root directory
**Scope**: Specific to this project
**Security**: Add to `.gitignore` before committing

---

## Security

### Authentication Flow

#### CLI Token Generation

1. Open web dashboard (http://localhost:3000)
2. Navigate to **Settings** → **Profile**
3. Click **"Generate CLI Token"** (px_...)
4. Copy the token (appears only once)
5. Run `projex login <token>` in terminal

#### Token Format

CLI tokens follow the pattern: `px_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

- **Prefix**: `px_` identifies token type
- **Length**: 32-character alphanumeric suffix
- **Scope**: Full access to assigned projects
- **Expiration**: User-defined (optional)

#### JWT Authentication

The backend uses JWT (Bearer tokens) for API requests:

```bash
curl -H "Authorization: Bearer $CLI_TOKEN" \
     http://localhost:3001/api/cli/projects/{id}/status
```

**Headers**:
```
Authorization: Bearer eyJhbGci...
Content-Type: application/json
```

### Token Security Best Practices

1. **Never commit** `.projex.json` to version control
2. **Use `.gitignore`**: Add `.projex.json` to `.gitignore` file
3. **Rotate tokens**: Regenerate CLI tokens periodically
4. **Restrict access**: Limit who has dashboard access
5. **Environment variables**: For CI/CD, use `PROJEX_TOKEN` env var
6. **Revoke immediately**: If token is compromised, generate a new one

### Data Validation

All API requests are validated:
- **UUID validation**: Project IDs must be valid UUIDs
- **JWT verification**: All tokens are verified server-side
- **Step validation**: Step numbers must exist in project
- **Status validation**: Only valid statuses are accepted

---

## Troubleshooting

### Common Issues

#### "Aucun projet lié dans ce dossier"

**Problem**: CLI can't find `.projex.json` in current directory

**Solution**:
```bash
# Navigate to project root
cd /path/to/your/project

# Link project with ID from dashboard
projex init 123e4567-e89b-12d3-a456-426614174000
```

#### "Terminal non connecté"

**Problem**: Global config missing or token expired

**Solution**:
```bash
# Generate new token from dashboard settings
# Then login
projex login px_your_new_token_here
```

**Verify**: Check if `~/.projex.json` exists
```bash
cat ~/.projex.json
```

#### "JWT Malformed"

**Problem**: Token format is invalid or corrupted

**Solution**:
1. Go to web dashboard → Settings
2. Delete the old CLI token
3. Generate a new one
4. Run `projex login <new_token>`

#### "Erreur 500" from API

**Problem**: Backend encountered an error

**Debugging**:
1. Check API logs: `npm run dev:api`
2. Verify database connection: `psql $DATABASE_URL`
3. Ensure JWT_SECRET is set correctly
4. Check project exists: Run `projex status` with verbose logging

#### Port 3000 / 3001 Already in Use

**Problem**: Another process is using the dev ports

**Solution - Option A**: Kill the process
```bash
# macOS/Linux
lsof -i :3000
lsof -i :3001

# Get PID and kill
kill -9 <PID>
```

**Solution - Option B**: Use different ports
```bash
# Frontend on 3002
PORT=3002 npm run dev:web

# Backend on 3003
PORT=3003 npm run dev:api
```

#### Dashboard Shows No Projects

**Problem**: Projects not loading from API

**Debugging**:
1. Check API is running: `curl http://localhost:3001/api/projects`
2. Verify database has projects: `psql -d projex -c "SELECT * FROM projects;"`
3. Check CORS configuration in Express
4. Verify `NEXT_PUBLIC_API_URL` matches API server

#### Web Dashboard Can't Connect to API

**Problem**: CORS or network connectivity issue

**Check**:
1. Verify API URL: `echo $NEXT_PUBLIC_API_URL`
2. Test API directly: `curl http://localhost:3001/api/health`
3. Check firewall/network: `telnet localhost 3001`

**Fix**: Restart both services
```bash
npm run dev  # Restarts all services
```

#### CLI Command Not Found

**Problem**: `projex` command not recognized

**Solution - Install Globally**:
```bash
npm install -g ./cli
```

**Verify**:
```bash
which projex
projex hello
```

### Debug Mode

Enable verbose logging:

```bash
# Frontend
DEBUG=* npm run dev:web

# Backend
DEBUG=* npm run dev:api

# CLI
DEBUG=* projex status
```

### Database Connection Issues

**Test Connection**:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

**Reset Database** (careful!):
```bash
psql -U postgres -d projex -c "DROP SCHEMA public CASCADE;"
psql -U postgres -f apps/api/sql/schema.sql
```

### Performance Issues

**Slow Dashboard Loading**:
1. Check network tab in DevTools (F12)
2. Monitor API response times: `curl -w "%{time_total}\n" http://localhost:3001/api/projects`
3. Query slow logs: Check PostgreSQL logs for slow queries

**Slow CLI Commands**:
1. Network latency: `ping localhost`
2. API responsiveness: `curl http://localhost:3001/api/health`
3. Database query performance: Verify indexes are created

---

## Glossary

### Projects

**Definition**: Top-level organizational unit grouping related tasks

**Properties**:
- `id`: Unique UUID identifier
- `name`: Display name
- `description`: Project overview
- `status`: Current state (see Status Types)
- `steps`: Array of associated tasks

**Example**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Build E-Commerce Platform",
  "description": "Complete online store with payments",
  "status": "active",
  "steps": [ /* array of steps */ ]
}
```

### Steps (Tasks)

**Definition**: Individual work items within a project

**Properties**:
- `number`: Sequential identifier (STP-1, STP-2...)
- `title`: Task description
- `status`: Current progress state
- `projectId`: Parent project reference

### Status Types

#### Project Statuses

| Status | Icon | Meaning | Behavior |
|--------|------|---------|----------|
| **active** | 🟢 | Actively being worked on | Default state for new projects |
| **paused** | 🟡 | Temporarily halted | No immediate work, may resume |
| **completed** | 🟢 | Finished successfully | Archive state, historical record |
| **abandoned** | 🔴 | No longer pursued | Explicitly cancelled |
| **future** | 🔵 | Planned but not started | Backlog item |

#### Step Statuses

| Status | Display Name | Icon | Progress Count | Use Case |
|--------|--------------|------|------------------|----------|
| **todo** | À faire | ⏳ | No | New tasks, backlog items |
| **in_progress** | En cours | 🚀 | No | Currently being worked on |
| **done** | Terminé | ✅ | Yes | Completed successfully |
| **skipped** | Ignoré | ❌ | Yes | Decided not to implement |

**Note**: Only `done` and `skipped` contribute to project progress percentage.

### CLI Token (Personal Access Token)

**Definition**: Secure credential for CLI authentication

**Format**: `px_` followed by 32-character alphanumeric string

**Scope**: Full access to all projects for authenticated user

**Security**: Should be treated like passwords — never commit or share

**Usage**:
```bash
projex login px_abcdef1234567890abcdef1234567890
```

### Configuration Files

#### `.projex.json` (Local)

Stores project-specific binding to project ID.

**Created by**: `projex init <id>`

**Contains**:
```json
{
  "projectId": "uuid-here"
}
```

**Location**: Project root directory

**Git**: Add to `.gitignore`

#### `~/.projex.json` (Global)

Stores CLI authentication token.

**Created by**: `projex login <token>`

**Contains**:
```json
{
  "cliToken": "px_token_here"
}
```

**Location**: User home directory

**Permissions**: Should be readable only by user (mode 600)

### API Endpoints

#### Projects

- `GET /api/projects` — List all projects
- `GET /api/projects/{id}` — Get project details
- `POST /api/projects` — Create new project
- `PATCH /api/projects/{id}` — Update project

#### Steps

- `GET /api/cli/projects/{projectId}/status` — Get project with all steps
- `POST /api/cli/projects/{projectId}/steps` — Add new step
- `PATCH /api/cli/projects/{projectId}/steps/{number}` — Update step status

### Real-time Synchronization

**Definition**: Process by which changes on CLI instantly appear on dashboard and vice versa

**Mechanism**:
1. CLI sends request to API
2. API updates database
3. Dashboard fetches fresh data on next render
4. Database serves latest state to both interfaces

**Latency**: Typically < 100ms for local development

**Note**: Dashboard does not use WebSockets — updates occur on user interaction (click, page load)

---

## Tips & Tricks

### Workflow Optimization

**Terminal-First Workflow**:
```bash
# 1. Create project on dashboard
# 2. Note the project ID (copy with button)
# 3. In your project folder:
projex init <project_id>
projex step:add "Feature: User authentication"
projex step:add "Feature: Database schema"
projex status

# 4. Start working
projex step:start 1

# 5. Check dashboard occasionally for overview
```

**Quick Status Check**:
```bash
alias pxs="projex status"
pxs  # Quick overview
```

**Batch Adding Steps**:
```bash
# Create multiple steps
projex step:add "Setup ESLint"
projex step:add "Setup Prettier"
projex step:add "Create CI pipeline"
projex step:add "Deploy to staging"
```

### Dashboard Bookmarking

Bookmark project detail pages for quick access:
- Dashboard: `http://localhost:3000`
- Project Detail: `http://localhost:3000/detail-project/[id]`

### Integrating with Git Hooks

Update step status on commit:

```bash
# .git/hooks/post-commit (example)
#!/bin/bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)
# Extract step number from branch name: feature/stp-5-auth
if [[ $BRANCH =~ stp-([0-9]+) ]]; then
  projex step:done ${BASH_REMATCH[1]}
fi
```

---

## Support & Feedback

For issues or feature requests:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review debug logs: Enable `DEBUG=*` before running commands
3. Verify environment setup matches this guide
4. Report bugs with: OS version, Node version, database version

---

**Projex v1.0.0** | Last Updated: 2026-05-06
