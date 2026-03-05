import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom/client", "react-dom/server"],
          "vendor-tiptap": [
            "@tiptap/react",
            "@tiptap/starter-kit",
            "@tiptap/extension-image",
            "@tiptap/extension-youtube",
          ],
          "vendor-dompurify": ["dompurify"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
