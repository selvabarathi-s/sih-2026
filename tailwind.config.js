/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f5fa',
          100: '#e1ebf5',
          200: '#c3d8eb',
          300: '#95bde0',
          400: '#609cd0',
          500: '#3c80bf',
          600: '#2b65a3',
          700: '#245285',
          800: '#1a3a60',
          900: '#0f243d',
          950: '#0a1626',
        },
        risk: {
          low: '#10b981',        // Emerald 500
          moderate: '#f59e0b',   // Amber 500
          high: '#f97316',       // Orange 500
          critical: '#ef4444',   // Red 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
