/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e", // romantic red-pink
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        peach: {
          100: "#fff5f0",
          200: "#ffe0d1",
          300: "#ffcbb3",
          400: "#ffb596",
          500: "#ff9f78",
          600: "#ff8a5a",
        },
        mandap: {
          DEFAULT: "#f3f0ec",
        },
      },
      fontFamily: {
        romantic: ['"Great Vibes"', "cursive"],
        elegant: ['"Poppins"', "sans-serif"],
      },
      backgroundImage: {
        wedding: "url('https://images.unsplash.com/photo-1689455611175-c5af6f5c573e?auto=format&fit=crop&w=1600&q=80')",
         profileTheme: "url('https://images.unsplash.com/photo-1530023367847-a683933f4172')",
      },
    },
  },
  plugins: [],
};
