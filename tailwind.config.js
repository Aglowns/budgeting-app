/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#990000", // UNCP maroon
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca", 
          300: "#fca5a5",
          400: "#f87171",
          500: "#990000",
          600: "#800000",
          700: "#7f1d1d",
          800: "#6b1d1d",
          900: "#5c1a1a",
        },
        secondary: {
          DEFAULT: "#FFCC00", // UNCP gold
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FFCC00",
          600: "#d69e2e",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        accent: {
          DEFAULT: "#000000", // UNCP black
          50: "#f8fafc",
          100: "#f1f5f9",
          500: "#000000",
          900: "#0f172a",
        },
        success: "#10b981",
        warning: "#f59e0b", 
        error: "#ef4444",
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'uncp': '0 4px 14px 0 rgba(153, 0, 0, 0.1)',
        'uncp-lg': '0 10px 25px -3px rgba(153, 0, 0, 0.1), 0 4px 6px -2px rgba(153, 0, 0, 0.05)',
        'gold': '0 4px 14px 0 rgba(255, 204, 0, 0.2)',
      },
      backgroundImage: {
        'uncp-gradient': 'linear-gradient(135deg, #990000 0%, #800000 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFCC00 0%, #d69e2e 100%)',
        'hero-gradient': 'linear-gradient(135deg, #990000 0%, #FFCC00 100%)',
      },
    },
  },
  plugins: [],
}
