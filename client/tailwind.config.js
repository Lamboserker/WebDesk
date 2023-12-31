import colors from "tailwindcss/colors";
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  mode: "jit",
  theme: {
    colors: {
      customLight: {
        DEFAULT: "#000000", // Schwarz für Light-Modus
      },
      customDark: {
        DEFAULT: "#FFFFFF", // Weiß für Dark-Modus
      },
      violet: colors.violet,
      rose: colors.rose,
      fuchsia: colors.fuchsia,
      indigo: colors.indigo,
      slate: colors.slate,
      white: colors.white,
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      red: colors.red,
      pink: colors.pink,
    },
    extend: {
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

      colors: {
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
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
