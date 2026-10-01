/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // <html class="dark"> থাকলে dark: ক্লাসগুলো কাজ করবে
  theme: {
    extend: {
      colors: {
        // রঙগুলো CSS variable থেকে আসে (src/index.css) — তাই theme বদলালে সব আপনাআপনি বদলায়
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", '"Hind Siliguri"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 8px 30px -8px rgb(var(--brand) / 0.45)",
        soft: "0 10px 40px -12px rgb(0 0 0 / 0.35)",
      },
      keyframes: {
        "fade-up": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { "fade-up": "fade-up .35s ease-out both" },
    },
  },
  plugins: [],
};