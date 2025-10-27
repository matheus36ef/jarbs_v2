/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d1117',
        'dark-surface': '#161b22',
        'dark-border': '#30363d',
        'dark-text': '#c9d1d9',
        'dark-text-secondary': '#8b949e',
        'accent-blue': '#58a6ff',
        'accent-green': '#3fb950',
        'accent-red': '#f85149',
      }
    },
  },
  plugins: [],
}
