import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
  },
});
