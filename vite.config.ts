import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.VITE_GEMINI_API_KEY),
      "process.env.VITE_STACK_PROJECT_ID": JSON.stringify(
        env.VITE_STACK_PROJECT_ID
      ),
      "process.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY": JSON.stringify(
        env.VITE_STACK_PUBLISHABLE_CLIENT_KEY
      ),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            ui: ["framer-motion", "lucide-react", "@radix-ui/react-accordion"],
            ai: ["@google/genai"],
            auth: ["@stackframe/react"],
            db: ["@supabase/supabase-js"],
          },
        },
      },
    },
    base: "/",
  };
});
