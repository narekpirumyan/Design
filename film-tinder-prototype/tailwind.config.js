/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899',
        secondary: '#f43f5e',
        accent: '#f59e0b',
        background: '#0f172a',
        surface: '#1e293b',
        'gradient-start': '#dc2626',
        'gradient-end': '#ec4899',
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
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

