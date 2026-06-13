import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "TIENDA JEROMY",
        short_name: "Jeromy POS",

        description:
          "Sistema de ventas e inventario",

        theme_color: "#15803d",

        background_color: "#15803d",

        display: "standalone",

        start_url: "/",

        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});