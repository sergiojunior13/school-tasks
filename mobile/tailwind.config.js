/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["NunitoSans_400Regular"],
        "sans-semibold": ["NunitoSans_600SemiBold"],
        "sans-bold": ["NunitoSans_700Bold"],
      },
      backgroundColor: {
        background: "#18181b",
      },
    },
  },
  plugins: [],
};
