---
name: portfolio-sync-deploy
description: "Use when setting up, syncing, and deploying a portfolio or static website across GitHub and Firebase. Covers creating a Git repo, pushing to GitHub, editing from another device, preparing a deployment, and using the 21st.dev MCP server for design or UI assistance."
argument-hint: "[project name or update task]"
user-invocable: true
---

# Portfolio Sync and Deploy

## When to Use

Use this skill when you need to:
- initialize a website project for Git version control
- connect a local project to a GitHub repository
- push updates so they can be edited from another device
- deploy a static site to Firebase Hosting
- keep a simple workflow for portfolio maintenance and content updates
- integrate 21st.dev MCP for UI or component guidance

Use it for static sites, personal portfolios, front-end prototypes, and small web projects. Skip it for backend-heavy apps that need a different deployment pipeline.

## Core Workflow

### 1. Confirm project structure

Check whether the project already contains the expected files:
- `index.html`
- `style.css`
- `main.js`
- `package.json`
- `firebase.json`
- `.gitignore`
- `README.md`

If the project is a static site, keep the deployment simple. Prefer GitHub for version control and Firebase Hosting for publishing.

### 2. Initialize Git if needed

If the folder is not already a valid Git repo, run:

```bash
git init
git branch -M main
```

If you already have a repo, confirm the current branch and remote:

```bash
git status
git remote -v
```

### 3. Set Git identity

Use your real name and email for the project:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

### 4. Create or attach the GitHub repository

If the project has no GitHub repo yet:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If the repo already exists and the remote is wrong or missing:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 5. Commit and push changes

For normal updates:

```bash
git add .
git commit -m "Update portfolio"
git push
```

Keep commits small and meaningful. Use descriptive messages like:
- "Add project section"
- "Fix mobile navigation"
- "Update contact information"
- "Refresh portfolio content"

### 6. Edit from any other device

Clone the project anywhere:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Then continue with:

```bash
git pull
# edit files

git add .
git commit -m "Update from another device"
git push
```

### 7. Prepare Firebase deployment

If Firebase CLI is not installed:

```bash
npm install -g firebase-tools
```

Log in once:

```bash
firebase login
```

Then deploy changes when the site should go live:

```bash
firebase deploy
```

If the repo is already linked to Firebase, this is usually enough. If not, initialize the project:

```bash
firebase init hosting
```

### 8. Validate before publishing

Before deployment, check:
- HTML loads without broken paths
- stylesheet links still resolve
- JS has no syntax issues
- Firebase config is correct
- project assets are included
- there is no accidental secret or private data in files

### 9. Use 21st.dev MCP when design or UI help is needed

If the local environment supports the 21st.dev MCP server, add it with:

```bash
claude mcp add --transport http 21st https://21st.dev/api/mcp --header "x-api-key: 21st_sk_••••••••••••96b3"
```

Use the MCP when you need:
- UI generation suggestions
- front-end components or layouts
- design system ideas
- faster prototyping for modern UI patterns

Keep the MCP use focused on design and UI tasks, not core project setup unless needed.

## Quality Checklist

Before finishing a portfolio update, confirm:
- GitHub repo is connected and updated
- commit history is clean
- the project still runs locally
- the site deploys successfully
- the live Firebase URL reflects the correct version
- no sensitive credentials are included in source control

## Commands Summary

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git

git add .
git commit -m "Update portfolio"
git push

firebase login
firebase deploy
```

## Best Practice

For personal portfolios, keep the workflow simple:
1. GitHub for source control
2. Firebase Hosting for deployment
3. One branch: `main`
4. Small, frequent commits
5. Deploy after each meaningful content or UI change

This keeps the project portable, versioned, and easy to maintain across multiple devices.
