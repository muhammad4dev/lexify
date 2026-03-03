import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/lexify/",
  optimizeDeps: {
    include: ["react", "react-dom", "lexical"],
  },
});
