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
        beige: {
          50:  "#FAF6F1",
          100: "#F7EFE6",
          200: "#F1E6D9",
          300: "#EADCCB",
          400: "#E2D1BB",
          500: "#D9C6AA",
          600: "#C7B493",
          700: "#A79378",
          800: "#8B775F",
          900: "#6F5E4B"
        }
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
