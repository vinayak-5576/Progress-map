/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1321',
          900: '#14233B', // Primary navy
          850: '#182A45',
          800: '#1E3252',
          700: '#2A456E',
          600: '#3A5C8E',
          500: '#5277AD',
          400: '#7599CC',
          300: '#A3BDE2',
          200: '#D0DEF0',
          100: '#EAF0F8',
          50: '#F5F8FC',
        },
        cream: {
          900: '#5C4E3C',
          800: '#7F6D56',
          700: '#A48E72',
          600: '#C2AC91',
          500: '#D9C5AD',
          400: '#E6D7C3',
          300: '#EFE5D6',
          200: '#F7F2E9',
          100: '#F4EEE3', // Primary cream
          50: '#FAF7F1',
        },
        coral: {
          900: '#641B14',
          800: '#8C271E',
          700: '#B83428',
          600: '#DB4B3D',
          500: '#F2685B', // Primary coral
          400: '#F5887D',
          300: '#F8AAA1',
          200: '#FCCDC7',
          100: '#FEE7E4',
          50: '#FFF5F4',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(20, 35, 59, 0.05)',
        'soft': '0 4px 20px -2px rgba(20, 35, 59, 0.07)',
        'soft-lg': '0 10px 30px -4px rgba(20, 35, 59, 0.1)',
        'glow-coral': '0 0 25px -3px rgba(242, 104, 91, 0.35)',
        'glow-navy': '0 0 30px -5px rgba(20, 35, 59, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
