/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/react-tailwindcss-select/dist/index.esm.js'],
  theme: {},
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
