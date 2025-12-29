/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // AQUI ESTÁ A MÁGICA
        fortune: ['"Titan One"', 'cursive'],
      },
      colors: {
        fortuneRed: {
          darkest: "#1a0000",
          dark: "#3d0000",
          base: "#6b0000",
          light: "#8a1c1c",
        },
        fortuneGold: {
          dark: "#b8860b", 
          base: "#ffd700",
          light: "#fff2b3",
        },
      },
      boxShadow: {
        'gold-glow-sm': '0 0 10px rgba(255, 215, 0, 0.5)',
        'gold-glow-md': '0 0 20px rgba(255, 215, 0, 0.6)',
        'gold-glow-lg': '0 0 40px rgba(255, 215, 0, 0.8)',
        'inset-gold': 'inset 0 0 20px rgba(255, 215, 0, 0.3)',
      },
      backgroundImage: {
        'reel-gradient': 'linear-gradient(to bottom, #2a0000, #4a0000 50%, #2a0000)',
        'gold-gradient': 'linear-gradient(to bottom, #ffd700, #b8860b)',
        'orb-gradient': 'radial-gradient(circle at 30% 30%, #ffd700, #b8860b 60%, #5e4300)',
      },
    },
  },
  plugins: [],
}