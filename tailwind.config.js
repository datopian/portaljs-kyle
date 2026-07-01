/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // City of Kyle brand palette (from the official logo).
      colors: {
        brand: {
          DEFAULT: '#173a64', // navy
          dark: '#0f2747',
          green: '#037b3e',
          red: '#c01f41',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
