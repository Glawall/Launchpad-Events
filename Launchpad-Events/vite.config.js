import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("VITE_BASE_PATH in config:", env.VITE_BASE_PATH);

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH,
    build: {
      outDir: "dist",
    },
  };
});
