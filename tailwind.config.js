/** @type {import('tailwindcss').Config} */
export default {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  content: [],
  theme: {
    extend: {
      colors: {
        cDark: "#2f184b",
        cWhite: "#f4effa",
        cPurple: "#532b88",
        cViolet: "#9b72cf",
        cLight: "#c8b1e4",
      },
    },
  },
  plugins: [require("daisyui")],
};
