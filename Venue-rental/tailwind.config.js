/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false,
  content: [],
  theme: {
    extend: {},
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '7/10': '70vh',
      '76vh': '76vh',
      '3/4': '75%',
      'full': '100%',
     }
  },
  plugins: [],
}

