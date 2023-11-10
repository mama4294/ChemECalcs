/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './node_modules/react-tailwindcss-select/dist/index.esm.js'],
  theme: {},
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#05bcc7',
          'primary-focus': '#0096a1',
          'primary-content': '#fefefe',

          secondary: '#00899f',
          'secondary-focus': '#0021ff',
          'secondary-content': '#fefefe',

          accent: '#05bcc7',
          'accent-focus': '#0096a1',
          'accent-content': '#fefefe',

          neutral: '#3b424e',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',

          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#ced3d9',
          'base-content': '#1e2734',

          info: '#1c92f2',
          success: '#009485',
          warning: '#ff9900',
          error: '#ff5724',
        },
        dark: {
          primary: '#05bcc7',
          'primary-focus': '#0096a1',
          'primary-content': '#fefefe',

          secondary: '#00899f',
          'secondary-focus': '#0021ff',
          'secondary-content': '#fefefe',

          accent: '#05bcc7',
          'accent-focus': '#0096a1',
          'accent-content': '#fefefe',

          neutral: '#2a2e37',
          'neutral-focus': '#16181d',
          'neutral-content': '#ffffff',

          'base-100': '#3b424e',
          'base-200': '#2a2e37',
          'base-300': '#16181d',
          'base-content': '#ebecf0',

          info: '#66c7ff',
          success: '#87cf3a',
          warning: '#e1d460',
          error: '#ff6b6b',
        },
      },
    ],
  },
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
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
