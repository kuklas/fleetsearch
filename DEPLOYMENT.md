# GitHub Pages Deployment Guide

## Option 1: Automatic Deployment with GitHub Actions (Recommended)

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub: https://github.com/kuklas/fleetsearch
   - Click on **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

2. **Push the workflow file:**
   - The workflow file (`.github/workflows/deploy.yml`) needs to be pushed to your repository
   - If you're getting OAuth permission errors, you may need to:
     - Use a Personal Access Token (PAT) with `workflow` scope
     - Or manually create the workflow file through GitHub's web interface

3. **The workflow will automatically:**
   - Build your application on every push to `main` branch
   - Deploy to GitHub Pages
   - Your site will be available at: `https://kuklas.github.io/fleetsearch/`

## Option 2: Manual Deployment with gh-pages

### Setup Steps:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

   This will:
   - Build your application
   - Deploy the `dist` folder to the `gh-pages` branch
   - Make it available on GitHub Pages

3. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under **Source**, select the `gh-pages` branch
   - Select `/ (root)` as the folder
   - Click **Save**

4. **Your site will be available at:**
   `https://kuklas.github.io/fleetsearch/`

## Important Notes:

- **Client-side Routing:** The `404.html` file handles React Router's client-side routing on GitHub Pages
- **Base Path:** If your repository name is `fleetsearch`, the base path is automatically configured
- **Custom Domain:** If you want to use a custom domain, add a `CNAME` file in the `public` folder

## Troubleshooting:

- If pages don't load, check that GitHub Pages is enabled in repository settings
- If routes don't work, ensure the `404.html` file is in the `dist` folder after build
- If assets don't load, check the browser console for path errors

