import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("VITE_BASE_PATH in config:", process.env.VITE_BASE_PATH);

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH,
  build: {
    outDir: "dist",
  },
});
