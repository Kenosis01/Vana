/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: '#1A2B20',      // Deep, dark forest green (top gradient)
          moss: '#3B3D2D',      // Warm, earthy, dark moss green (bottom gradient)
          input: '#223528',     // Very dark, desaturated green (input background)
          inputHover: '#2A4031', // Slightly lighter background for hover states
          button: '#2E8B57',    // Sea Green (primary button)
          text: {
            primary: '#F0F2EF',  // Soft off-white (main text)
            secondary: '#A0A8A2', // Muted, light sage gray (secondary text)
            placeholder: '#788A7F' // Muted, light-greenish-gray (placeholder text)
          },
          accent: '#6A826D',    // Brighter green for accents and highlights
          codePane: '#1F3025'   // Slightly lighter dark green for code panel
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'growing-sapling': 'growing-sapling 2s ease-in-out infinite',
      },
      keyframes: {
        'growing-sapling': {
          '0%': { transform: 'scale(0.5)', opacity: 0.7 },
          '50%': { transform: 'scale(1.1)', opacity: 1 },
          '100%': { transform: 'scale(0.5)', opacity: 0.7 },
        },
      },
    },
  },
  plugins: [],
}