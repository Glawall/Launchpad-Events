import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH, // Use the base path from the environment variables
  build: {
    outDir: "../docs", // Output the build files into the /docs folder (for GitHub Pages)
  },
});
