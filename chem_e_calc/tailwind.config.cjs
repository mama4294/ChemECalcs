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
  theme: {
    extend: {
      animation: {
        blob: 'blob 6s infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(20px, -40px) scale(1.2)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.8)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
}
