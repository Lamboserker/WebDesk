import withMT from "@material-tailwind/react/utils/withMT";
import "flowbite";
export default withMT({
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "node_modules/flowbite-react/lib/esm/**/*.{js,jsx,ts,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-turquoise-purple-blue":
          "linear-gradient(90deg, #00CED1, #800080, #00008B)",
        "custom-gradient": "linear-gradient(90deg, #ffffff, #6b6bff, #14cdf2)",
        "button-svg": "url('/src/assets/img/button.jpg')",
      },
      colors: {
        backgroundColor: {
          primary: "#676eeb", // Hintergrundfarbe für primäre Elemente
        },
        borderColor: {
          primary: "#676eeb", // Rahmenfarbe für primäre Elemente
        },
        luckyPoint: {
          50: "#f4f6fe",
          100: "#eaedfd",
          200: "#d9dffb",
          300: "#bac3f8",
          400: "#939df2",
          500: "#676eeb",
          600: "#4947e0",
          700: "#3a34cd",
          800: "#302cab",
          900: "#29258d",
          950: "#16165f",
        },
        sidebarblue: { 200: "#16165f" },
        mainContent: { 200: "#f4f6fe" },
        searchbar: { 200: "#eaedfd" },
        orange: {
          250: "#FF5810",
          350: "#FF5D5D",
        },
        yellow: {
          150: "#FF900C",
        },
        purple: {
          350: "#5568FE",
          550: "#596BFF",
          600: "#586FEA",
          650: "#2B3480",
          700: "#4F63D2",
          750: "#6246FB",
          300: "#4658BB",
        },
        red: { 150: "#D32F2F", 650: "#F44339" },
        pink: {
          150: "#EC4899",
          250: "#FFB5B5",
          750: "#2c1a22",
        },
        green: {
          150: "#3BA55D",
          250: "#40A954",
          350: "#34A85333",
          450: "#34A85380",
          550: "#87E5A2",
          650: "#96F3D24D",
          750: "#A3FEE3",
        },
        blue: {
          350: "#76d9e6",
        },
        gradientTurquoise: "#00CED1",
        gradientPurple: "#800080",
        gradientBlue: "#00008B",
      },
    },
    fontFamily: {
      lato: ["lato", "sans-serif"],
      sans: [
        "lato",
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      mono: ["Source Code Pro", "Menlo", "monospace"],
    },
    animation: {
      gradient: "gradient 8s linear infinite",
    },
    keyframes: {
      gradient: {
        to: { backgroundPosition: "200% center" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
});
