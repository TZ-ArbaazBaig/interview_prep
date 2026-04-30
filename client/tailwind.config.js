/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0A0C10',
          800: '#141820',
          700: '#1E2530',
        },
        copper: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f59e0b', // Burnished Copper
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        parchment: {
          50: '#FDFCF0',
          100: '#F8F6E2',
          200: '#E2E8F0', // Muted Slate-Parchment mix
        }
      },
    },
  },
  plugins: [],
}
