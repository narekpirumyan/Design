/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
        text: {
          primary: '#f1f5f9',
          secondary: '#cbd5e1',
          muted: '#94a3b8'
        },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b'
      },
    },
  },
  plugins: [],
}

