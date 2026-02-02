/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: "#7C3AED",
          "violet-light": "#8B5CF6",
        },
        surface: {
          primary: "#FFFFFF",
          secondary: "#F3F4F6",
          cream: "#FEF3C7",
          mint: "#D1FAE5",
          indigo: "#E0E7FF",
        },
        accent: {
          success: "#4ADE80",
          gold: "#FCD34D",
          selected: "#93C5FD",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
