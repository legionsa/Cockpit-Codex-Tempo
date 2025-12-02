import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "development" ? "/" : process.env.VITE_BASE_PATH || "/",
  optimizeDeps: {
    entries: ["src/main.tsx", "src/tempobook/**/*"],
  },
  plugins: [
    react(),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs', 'lucide-react', 'framer-motion'],
          'vendor-editor': ['@editorjs/editorjs', '@editorjs/header', '@editorjs/list', '@editorjs/paragraph', '@editorjs/image', '@editorjs/code', '@editorjs/raw', '@editorjs/quote', '@editorjs/table', '@editorjs/delimiter', '@editorjs/checklist', '@editorjs/warning', '@editorjs/embed'],
        },
      },
    },
  },
});
