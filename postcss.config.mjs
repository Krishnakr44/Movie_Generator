import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Resolve from project so Next's PostCSS loader finds tailwindcss and autoprefixer
export default {
  plugins: [
    [require.resolve("tailwindcss"), {}],
    [require.resolve("autoprefixer"), {}],
  ],
};
