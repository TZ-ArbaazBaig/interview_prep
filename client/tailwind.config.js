/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#050505',
          900: '#0A0A0A',
          800: '#121212',
          700: '#1A1A1A',
          600: '#262626',
        },
        violet: {
          500: '#8F00FF',
          600: '#7A00DB',
          400: '#A855F7',
        },
        silver: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'violet-glow': '0 0 20px -5px rgba(143, 0, 255, 0.3)',
        'violet-glow-lg': '0 0 40px -10px rgba(143, 0, 255, 0.5)',
      }
    },
  },
  plugins: [],
}
