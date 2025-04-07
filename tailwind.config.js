/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js",
    "./**/*.{html,js}" // Note the comma between extensions
  ],
  theme: {
    extend: {},
    'se': '375px',      // iPhone SE
      'ipad': '768px', // iPad Mini
  },
  plugins: [],
}