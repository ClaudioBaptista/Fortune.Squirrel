/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slotBg: "#2b0642", // Roxo escuro
        slotReel: "#150224", // Fundo dos rolos
        gold: "#FFD700",   // Dourado
        neonPink: "#ff00ff", // Rosa Neon
      },
    },
  },
  plugins: [],
}