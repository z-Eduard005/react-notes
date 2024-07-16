/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    screens: {
      'max-2xl': { 'max': '1399.5px' },
      'max-xl': { 'max': '1199.5px' },
      'max-lg': { 'max': '991.5px' },
      'max-md': { 'max': '767.5px' },
      'max-sm': { 'max': '575.5px' },
      'max-xs': { 'max': '431px' },
      'max-2xs': { 'max': '375px' },
    },
    extend: {}
  },
  plugins: [],
}

