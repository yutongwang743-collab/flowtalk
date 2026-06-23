---
name: windows-dev-rescue
description: "Fix Windows Next.js/Prisma dev environment issues: EPERM/DLL lock errors, .next cache corruption, port conflicts, dev server hanging. Use whenever you encounter build failures, Prisma errors, or dev server problems on Windows — especially when error messages mention EPERM, permission denied, port in use, or the dev server behaves unexpectedly (white screen, 404, full reload)."
---

# Windows Dev Rescue

Fix common Windows-specific Next.js + Prisma development issues in one shot.

## When to Use

This skill fires when you hit any of these symptoms:
- `prisma generate` fails with `EPERM: operation not permitted`
- Build or dev server shows stale/corrupted output (white screen, 404 on existing pages)
- `Port 3000 is in use` or `Something is already running on port 3000`
- `Fast Refresh had to perform a full reload` repeatedly
- `Cannot find module './xxx.js'` after previously working fine
- Prisma-related DLL lock errors mentioning `query_engine-windows.dll.node`

## The Universal Fix Sequence

Run these steps in order. Stop when the problem is resolved — you don't always need all steps.

### Step 1: Kill all Node processes

```powershell
taskkill /f /im node.exe 2>$null
```

This frees Prisma DLL locks and kills hung dev servers. Every Node process dies — the user will restart what they need.

### Step 2: Nuke the build cache

```bash
rm -rf .next
```

The `.next` cache is the #1 cause of "it was working, now it's not" on Windows. Deleting it forces a clean rebuild. This is safe — Next.js regenerates it.

### Step 3: Nuke the Prisma client cache

```bash
rm -rf node_modules/.prisma
```

Prisma's generated client sometimes holds file locks even after the process dies. Deleting this forces regeneration.

### Step 4: Regenerate Prisma client

```bash
npx prisma generate
```

This recompiles the Prisma client. If it still fails with EPERM, there's a lingering process — go back to Step 1 and check for node processes manually:

```powershell
Get-Process node -ErrorAction SilentlyContinue
```

### Step 5: Restart dev server

```bash
npm run dev
```

Start fresh. Monitor for the "Ready in Xms" message to confirm success.

### Step 6: Verify

Hit `http://localhost:3000` (or whatever port the server says) to confirm it loads. If the user was on a specific page, hit that page too.

## Quick Fix (no diagnosis needed)

If you're in a hurry and just want everything reset:

```powershell
taskkill /f /im node.exe 2>$null
```

```bash
rm -rf .next node_modules/.prisma && npx prisma generate && npm run dev
```

## Prisma-Specific Notes

- The EPERM happens because Prisma's query engine DLL is loaded by the Node process. Even after the dev server stops, the DLL can stay locked for a few seconds.
- `prisma db push` and `prisma generate` both touch the same `node_modules/.prisma` directory. If either fails with EPERM, kill node first.
- On Windows, `prisma generate` writes platform-specific binaries (`.dll.node`). The Linux/macOS equivalents don't have this locking problem.

## Why This Happens (so you can explain to the user)

Windows file locking is more aggressive than Unix. When a Node process loads a native `.dll.node` module (like Prisma's query engine), Windows locks the file until the process exits. If the dev server crashes or is killed abruptly, the lock sometimes persists. The fix is always: kill node → clean caches → regenerate → restart.
