import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: mode === "production" ? "/Launchpad-Events/" : "/",
    build: {
      outDir: "dist",
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:8006",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  };
});
