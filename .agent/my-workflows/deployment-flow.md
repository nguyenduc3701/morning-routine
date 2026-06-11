# Deployment Workflow (Develop -> Main -> Vercel)

This workflow outlines the standard procedure for pushing code changes to production. All AI assistants must follow these steps when asked to "deploy", "release", or "push to production".

## Step 1: Commit and Push to `develop`
All active development happens on the `develop` branch.
1. Ensure you are on the `develop` branch:
   ```bash
   git checkout develop
   ```
2. Check the status and stage changes:
   ```bash
   git status
   git add .
   ```
3. Commit with a descriptive message:
   ```bash
   git commit -m "feat/fix/chore: description of changes"
   ```
4. Push to the remote `develop` branch:
   ```bash
   git push origin develop
   ```

## Step 2: Merge `develop` into `main`
The `main` branch represents the production-ready state.
1. Switch to the `main` branch:
   ```bash
   git checkout main
   ```
2. Pull the latest changes to ensure your local `main` is up-to-date:
   ```bash
   git pull origin main
   ```
3. Merge the `develop` branch into `main`:
   ```bash
   git merge develop
   ```
4. Push the updated `main` branch to the remote repository:
   ```bash
   git push origin main
   ```

## Step 3: Build and Deploy to Vercel
In a standard Next.js + Vercel setup, pushing to the `main` branch will automatically trigger a production deployment.

### Option A: Automatic Deployment (Recommended)
If the GitHub repository is linked to Vercel, simply pushing to `main` (as done in Step 2) is enough.
- Vercel will automatically start building the `main` branch.
- *Note: Ghi chú cho AI - Có thể sử dụng Vercel MCP plugin để kiểm tra trạng thái deploy.*

### Option B: Manual Trigger (Vercel CLI)
If you need to manually trigger a production build using Vercel CLI, run:
```bash
# Ensure you are on the main branch
pnpm dlx vercel --prod
```

## Step 4: Cleanup
After a successful deployment, switch back to the `develop` branch to continue working:
```bash
git checkout develop
```
