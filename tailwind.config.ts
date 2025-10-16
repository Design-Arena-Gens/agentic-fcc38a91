import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-navy": "#0b1e3f",
        "brand-teal": "#00bfa6"
      }
    }
  },
  plugins: []
};

export default config;
