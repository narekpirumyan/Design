# Using GitHub Codespaces - Step by Step Guide

GitHub Codespaces is a cloud-based development environment that runs in your browser. Perfect if you can't install Node.js locally!

## Prerequisites

- A GitHub account (free account works)
- Internet connection

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com/
2. Click "Sign up"
3. Create your account (it's free)

## Step 2: Create a New Repository

1. Log in to GitHub
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository settings:
   - **Name:** `film-tinder-prototype` (or any name you like)
   - **Description:** "Film Tinder mobile app UI/UX prototype"
   - **Visibility:** Choose **Public** (free) or **Private** (if you have GitHub Pro)
   - **DO NOT** check "Add a README file" (we'll upload files)
   - Click **"Create repository"**

## Step 3: Upload Your Project to GitHub

You have two options:

### Option A: Using GitHub Web Interface (Easiest)

1. On your new repository page, click **"uploading an existing file"**
2. Drag and drop ALL files from `film-tinder-prototype/` folder:
   - `package.json`
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`
   - `README.md`
   - `.gitignore`
   - The entire `src/` folder
3. Scroll down, add commit message: "Initial commit - Film Tinder prototype"
4. Click **"Commit changes"**

### Option B: Using Git Command Line (if you have Git installed)

```powershell
cd film-tinder-prototype
git init
git add .
git commit -m "Initial commit - Film Tinder prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/film-tinder-prototype.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 4: Open in Codespaces

1. Go to your repository on GitHub
2. Click the green **"Code"** button
3. Click the **"Codespaces"** tab
4. Click **"Create codespace on main"**
5. Wait 1-2 minutes for the environment to set up

## Step 5: Install Dependencies

Once Codespaces opens (it looks like VS Code in the browser):

1. Open the terminal in Codespaces:
   - Click **Terminal** → **New Terminal** (or press `` Ctrl+` ``)
2. Install dependencies:
   ```bash
   npm install
   ```
   This will take 1-2 minutes

## Step 6: Start the Development Server

In the terminal, run:
```bash
npm run dev
```

You'll see output like:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 7: Access Your App

1. **Codespaces will automatically forward the port**
2. Look for a popup notification saying "Port 5173 is available"
3. Click **"Open in Browser"** or click the **"Ports"** tab
4. Click the **globe icon** 🌐 next to port 5173
5. Your app opens in a new tab!

## Step 8: Share Your Demo

### Share the Codespace URL:
1. Click the **"Ports"** tab in Codespaces
2. Right-click on port 5173
3. Select **"Port Visibility"** → **"Public"**
4. Copy the URL (looks like: `https://xxxxx-5173.app.github.dev`)
5. Share this URL with anyone - they can view your demo!

### Or Share the Repository:
- Share your GitHub repository URL
- Others can open it in their own Codespaces

## Tips & Tricks

### Auto-Start on Codespace Creation

Create a `.devcontainer/devcontainer.json` file to auto-install dependencies:

```json
{
  "name": "Film Tinder Prototype",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:18",
  "postCreateCommand": "npm install",
  "forwardPorts": [5173],
  "portsAttributes": {
    "5173": {
      "label": "Vite Dev Server",
      "onAutoForward": "openBrowser"
    }
  }
}
```

### Saving Your Work

- All changes are automatically saved to your repository
- Commit changes: Click the Source Control icon → Commit → Push

### Stopping Codespaces

- Codespaces stop automatically after 30 minutes of inactivity
- To stop manually: Click your profile → Codespaces → Stop
- To delete: Click your profile → Codespaces → Delete

## Cost Information

- **Free tier:** 60 hours/month of Codespaces usage
- **More than enough** for prototyping and demos
- If you exceed, you can use the static HTML demo instead

## Troubleshooting

### Port not forwarding?
- Go to **Ports** tab
- Make sure port 5173 is set to **Public**

### npm install fails?
- Make sure you're in the project root directory
- Try: `npm install --legacy-peer-deps`

### Can't see the app?
- Check the **Ports** tab for the forwarded URL
- Make sure the dev server is running (`npm run dev`)

### Codespace is slow?
- This is normal for free tier
- Consider using the static HTML demo for faster loading

## Alternative: Use GitHub Pages (Static Hosting)

If you want a permanent URL without running a server:

1. Build the project: `npm run build`
2. Go to repository **Settings** → **Pages**
3. Select source: **GitHub Actions**
4. Your app will be available at: `https://YOUR_USERNAME.github.io/film-tinder-prototype/`

## Next Steps

Once your Codespace is running:
1. ✅ Your app is accessible via the forwarded port
2. ✅ You can edit code directly in the browser
3. ✅ Changes auto-reload (hot reload)
4. ✅ Share the URL with others
5. ✅ No local installation needed!

Enjoy your cloud-based development environment! 🚀

