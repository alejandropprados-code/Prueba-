import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// En producción (GitHub Pages) la app se sirve desde /Prueba-/.
// En desarrollo local se sirve desde la raíz.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Prueba-/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
}));
