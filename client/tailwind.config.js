/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff9ff",
          100: "#dcf1ff",
          200: "#b3e4ff",
          300: "#74d1ff",
          400: "#2cb8ff",
          500: "#009dff",
          600: "#0080e6",
          700: "#0066ba",
          800: "#065799",
          900: "#0a4a7d",
        },
        accent: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc071",
          400: "#ff9d38",
          500: "#ff7e12",
          600: "#f06308",
          700: "#c74a09",
          800: "#9e3a10",
          900: "#7f3210",
        },
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(rgba(10,20,40,0.55), rgba(10,20,40,0.55))",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(10, 74, 125, 0.25)",
      },
    },
  },
  plugins: [],
};
