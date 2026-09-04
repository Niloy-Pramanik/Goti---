/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        slate: {
          50: '#F7F8F9', // Teamcamp very soft background
          100: '#F1F3F5',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B', // Teamcamp body text
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Teamcamp headings & buttons
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Teamcamp blue accent
          600: '#2563eb',
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
