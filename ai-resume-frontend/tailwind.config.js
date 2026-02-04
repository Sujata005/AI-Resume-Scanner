/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7c3aed",   // violet-600
        accent: "#22c55e",    // green-500
        dark: "#0f172a",      // slate-900
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [],
}

