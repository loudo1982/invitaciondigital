/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['Inter', "ui-sans-serif", "system-ui"],
      },
      colors: {
        gold: {
          300: "#E6D9B7",
          400: "#D8C69A",
          500: "#C7B37A",
        },
      },
      boxShadow: {
        soft: "0 6px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
