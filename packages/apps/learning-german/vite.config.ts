import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkGfm], providerImportSource: "#/components/mdx/provider" }) },
    tailwindcss(),
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
});
