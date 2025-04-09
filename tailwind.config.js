/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./script.js",
    "./**/*.{html,js}"
  ],
  theme: {
    extend: {
      // No screens configuration needed here in v4.1
    }
  },
  plugins: [],
};