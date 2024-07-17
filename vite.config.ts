import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: "Sudoku",
        short_name: "Sudoku",
        description: "Sudoku",
        theme_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/favicon.ico",
            sizes: "64x64 48x48 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
