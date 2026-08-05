/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#18221b',
        paper: '#f7f8f3',
        leaf: { 50: '#eefbf2', 100: '#daf5e2', 500: '#2fa866', 600: '#238851', 700: '#1d7044' },
        sun: '#f6c453',
        coral: '#f07c5d',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 18px 50px rgba(32, 55, 39, 0.08)',
        lift: '0 10px 24px rgba(35, 136, 81, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
