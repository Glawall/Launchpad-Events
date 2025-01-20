export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: mode === "production" ? "/Launchpad-Events/" : "/",
    build: {
      outDir: "dist",
    },
  };
});
