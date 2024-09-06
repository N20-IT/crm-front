/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    colors: {
      orange: "#FC8721",
      grey: "#535968",
      "dark-blue": "#272F3E",
      black: "#000000",
      white: "#FFFFFF",
    },
    fontFamily: {
      poppins: ["Poppins", "Arial"],
    },
    extend: {
      maxHeight: {
        "126": "505px",
      },
    },
  },
  plugins: [],
};
