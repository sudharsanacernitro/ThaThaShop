/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/src/assets/herobg.png')",
      },

      keyframes: {
        rotateTo90: {
          '0%': { transform: 'rotate(45deg)' },
          '25%': { transform: 'rotate(-45deg)' },
          '50%': { transform: 'rotate(90deg)' },
          '100%': { transform: 'rotate(45deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      animation: {
        rotateTo90: 'rotateTo90 0.5s ease-in-out forwards',
        blink: 'blink 1s infinite',
      },
      
    },
  },
  plugins: [],
};