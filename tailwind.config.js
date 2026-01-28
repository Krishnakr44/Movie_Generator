/**
 * Design system: premium fiction story generator.
 * Dark-mode-first palette (ink, parchment, night); minimal and cinematic.
 * Colors resolve from CSS variables so light theme can override via html.light.
 * Using .js to avoid path resolution issues on Windows (PostCSS/Tailwind).
 */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "var(--ink-950)",
          900: "var(--ink-900)",
          800: "var(--ink-800)",
          700: "var(--ink-700)",
          600: "var(--ink-600)",
          500: "var(--ink-500)",
          400: "var(--ink-400)",
        },
        parchment: {
          100: "var(--parchment-100)",
          200: "var(--parchment-200)",
          300: "var(--parchment-300)",
          400: "var(--parchment-400)",
        },
        accent: {
          DEFAULT: "var(--accent-default)",
          light: "var(--accent-light)",
          dark: "var(--accent-dark)",
          muted: "var(--accent-muted-rgba)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-crimson)", "Georgia", "serif"],
      },
      fontSize: {
        "reader-sm": ["1rem", { lineHeight: "1.75" }],
        reader: ["1.125rem", { lineHeight: "1.8" }],
        "reader-lg": ["1.25rem", { lineHeight: "1.75" }],
      },
      maxWidth: {
        reader: "42rem",
        "prose-narrow": "50ch",
      },
      spacing: {
        "reader-x": "clamp(1rem, 5vw, 2rem)",
      },
      borderRadius: {
        card: "0.75rem",
        input: "0.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
        "card-hover":
          "0 4px 12px -2px rgb(0 0 0 / 0.12), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
        glow: "0 0 0 1px rgba(180, 83, 9, 0.2)",
      },
      transitionDuration: {
        smooth: "200ms",
        gentle: "300ms",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
