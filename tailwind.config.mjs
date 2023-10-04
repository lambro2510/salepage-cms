import CONFIG from './config';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: CONFIG.theme.accentColor,
      },
    },
  },
  button : {
    className: 'bg-cyan-500'
  },
  plugins: [],
};
