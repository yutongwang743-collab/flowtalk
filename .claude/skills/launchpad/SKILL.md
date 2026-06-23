---
name: launchpad
description: "Deploy a project from zero to production: Git init → GitHub repo → database migration (SQLite→PostgreSQL/Neon) → Vercel deploy → environment variables → verify. Use when the user says 'deploy', 'go live', 'launch', 'put it online', 'ship it', 'publish', '上线', '部署'. Also use when starting a new project that needs the full deployment pipeline set up."
---

# LaunchPad: Zero to Production

Take any Next.js + Prisma project from local-only to a live production site with Git → GitHub → Database → Vercel in one flow.

## Pre-flight Check

Before starting, verify:
1. The project builds locally (`npm run build` passes)
2. The user has a GitHub account and is logged in (`gh auth status`)
3. The user has a Vercel account (vercel.com, can use GitHub login)
4. The user has or can create a Neon account (neon.tech, free tier)

## The Pipeline

### Step 1: Prepare .gitignore

If no `.gitignore` exists, create one:

```
/node_modules
/.next/
.env
.env*.local
/prisma/*.db
/prisma/*.db-journal
/build
*.tsbuildinfo
next-env.d.ts
.vercel
.vscode/
.idea/
*.pem
.DS_Store
```

### Step 2: Initialize Git & First Commit

```bash
cd <project-dir>
git init
git add .
git commit -m "feat: initial commit — <project-name>"
```

### Step 3: Create GitHub Repository

```powershell
gh repo create <repo-name> --public --source=. --remote=origin --push --description "<description>"
```

If `gh` is not installed:
```powershell
winget install GitHub.cli
```

### Step 4: Database Migration (SQLite → PostgreSQL)

**If the project uses SQLite (file:./dev.db):**

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Ask the user to create a Neon project at neon.tech and provide the DATABASE_URL

3. Create `.env` with the URL:
```
DATABASE_URL="postgresql://..."
```

4. Push schema and seed:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Important**: If the app uses anonymous users or hardcoded user IDs, ensure they exist in the new database:
```javascript
await prisma.user.upsert({
  where: { email: 'anonymous@domain.local' },
  update: {},
  create: { id: 'anonymous-user-001', name: '匿名用户', email: 'anonymous@domain.local' },
});
```

### Step 5: Vercel Deployment

**Preferred approach (web dashboard):**
Guide the user to:
1. Go to vercel.com → sign in with GitHub
2. New Project → import the repo
3. Add environment variable: `DATABASE_URL` = `<Neon connection string>`
4. Click Deploy

**CLI approach (if interactive prompts are handled):**
```bash
npm install -g vercel
vercel --prod --env DATABASE_URL="<connection-string>"
```

### Step 6: Verify

After deployment:
1. Hit the production URL for the homepage
2. Navigate to the main content pages
3. Test one API endpoint (e.g., `/api/lessons`)
4. Check Vercel logs for any errors:
```bash
vercel logs --project <project-name>
```

### Step 7: Document the Setup

Tell the user these key facts:
- **GitHub repo URL** for future reference
- **Production URL** for sharing
- **Database** is on Neon (separate from Vercel)
- **Auto-deploy is active**: `git push` → Vercel redeploys automatically
- **Workflow going forward**: local changes → commit → push → auto-deploy

## Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Build fails on Vercel, works locally | Missing env var | Add DATABASE_URL in Vercel dashboard |
| API returns 500 | Anonymous user missing | Run upsert script for seed users |
| Content not showing | Seed data uses wrong field names | Check category/tag field values match frontend maps |
| Page shows old data after redeploy | Vercel CDN cache | Add `?t=<timestamp>` to URL or wait 1-2 min |
| `prisma generate` fails on Vercel | Needs DATABASE_URL at build time | Ensure `postinstall: prisma generate` in package.json AND DATABASE_URL set in Vercel |

## For Projects Already Using PostgreSQL

Skip Step 4. Just ensure the DATABASE_URL in Vercel points to the existing database. The schema push and seed were done locally — the production site shares the same database.
