import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default {
  plugins: [react()],
  base: "/Launchpad-Events/", // Set this to your GitHub repo name
  build: {
    outDir: "../docs", // Output the build files into the /docs folder
  },
};
