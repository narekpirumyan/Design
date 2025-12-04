# Setup Instructions for Film Tinder Prototype

## Node.js Installation Required

You need to install Node.js to run this prototype. Here are the steps:

### Option 1: Install Node.js (Recommended)

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the LTS (Long Term Support) version for Windows
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard (accept defaults)
   - Make sure "Add to PATH" is checked during installation

3. **Verify Installation:**
   - Close and reopen your terminal/PowerShell
   - Run these commands to verify:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (e.g., v18.17.0 and 9.6.7)

4. **Install Project Dependencies:**
   ```powershell
   cd film-tinder-prototype
   npm install
   ```

5. **Start Development Server:**
   ```powershell
   npm run dev
   ```

### Option 2: Use nvm-windows (Node Version Manager)

If you want to manage multiple Node.js versions:

1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Open a new PowerShell/Command Prompt as Administrator
4. Install Node.js:
   ```powershell
   nvm install lts
   nvm use lts
   ```
5. Then follow steps 4-5 from Option 1

### Option 3: Alternative - Use Online Code Editor

If you can't install Node.js locally, you can use an online editor:

1. **CodeSandbox:**
   - Go to https://codesandbox.io/
   - Create a new React project
   - Upload the project files

2. **StackBlitz:**
   - Go to https://stackblitz.com/
   - Create a new React project
   - Upload the project files

3. **GitHub Codespaces:**
   - If you have a GitHub account
   - Create a repository and use Codespaces

## After Installation

Once Node.js is installed:

1. **Navigate to project:**
   ```powershell
   cd film-tinder-prototype
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```
   This will install all required packages (React, Vite, Tailwind, etc.)

3. **Start the development server:**
   ```powershell
   npm run dev
   ```

4. **Open in browser:**
   - The terminal will show a URL like `http://localhost:5173`
   - Open this URL in your browser
   - Use browser DevTools (F12) to enable mobile viewport emulation

## Troubleshooting

### If npm install fails:
- Make sure you're in the `film-tinder-prototype` directory
- Try running PowerShell as Administrator
- Check your internet connection

### If the dev server doesn't start:
- Make sure port 5173 is not in use
- Try a different port: `npm run dev -- --port 3000`

### If you see module errors:
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

## Quick Test

After installation, you should be able to run:
```powershell
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
```

Then in the project directory:
```powershell
npm install       # Installs dependencies
npm run dev       # Starts the server
```

## System Requirements

- Windows 10/11
- At least 4GB RAM
- Internet connection (for downloading packages)
- Modern web browser (Chrome, Firefox, Edge)

