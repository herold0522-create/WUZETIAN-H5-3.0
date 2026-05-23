import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/WUZETIAN-H5-3.0/",
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});
