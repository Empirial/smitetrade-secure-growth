import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-firebase": ["firebase/app", "firebase/auth", "firebase/firestore", "firebase/storage"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-tabs", "@radix-ui/react-tooltip", "@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-dropdown-menu", "@radix-ui/react-label", "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-radio-group", "@radix-ui/react-scroll-area", "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-switch", "@radix-ui/react-toast"],
          "vendor-charts": ["recharts"],
          "vendor-motion": ["framer-motion"],
          "vendor-pdf": ["jspdf"],
          "vendor-barcode": ["@zxing/browser", "@zxing/library"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
}));
