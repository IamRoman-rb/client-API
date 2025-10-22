import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 🔹 Login y registro → backend ya tiene /api/
      "/auth": {
        target: "http://localhost:8080/api/v1/auth",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ""), // quita "/auth"
      },

      // 🔹 Otras rutas → backend NO tiene /api/
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // quita "/api"
      },
    },
  },
});
