import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import remarkGfm from "remark-gfm";
import { THEME_INIT_SCRIPT } from "@zwi/ui/theme-init";
import { defineConfig } from "vite";
import { remarkLessonPages } from "./plugins/remark-lesson-pages.ts";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkGfm, remarkLessonPages], providerImportSource: "#/components/mdx/provider" }),
    },
    {
      name: "theme-init-script",
      transformIndexHtml: (html) => html.replace("<!--theme-init-->", `<script>${THEME_INIT_SCRIPT}</script>`),
    },
    tailwindcss(),
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
});
