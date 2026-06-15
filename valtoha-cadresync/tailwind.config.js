/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ajeevikaGreen: '#059669',   // Official Emerald Green
        ajeevikaSaffron: '#f59e0b', // Official Saffron Orange
        defaulterRed: '#fef2f2',    // Soft light red background for list rows
      }
    },
  },
  plugins: [],
}