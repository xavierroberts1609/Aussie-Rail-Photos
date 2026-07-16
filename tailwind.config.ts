import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          panel: "#141414",
          raised: "#1c1c1c",
          border: "#2a2a2a",
        },
        gold: {
          DEFAULT: "#6d8a73",
          light: "#8aa18f",
          dark: "#526856",
        },
        bone: {
          DEFAULT: "#f5f5f0",
          muted: "#a3a39c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #8aa18f 0%, #6d8a73 50%, #526856 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
