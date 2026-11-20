import { fileURLToPath } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { THEME_INIT_SCRIPT } from "@zwi/ui/theme-init";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import { lessonMeta } from "./plugins/lesson-meta.ts";
import { remarkLessonPages } from "./plugins/remark-lesson-pages.ts";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Firestore pulls in re2js only for pipeline regexes, which we don't use (see the stub).
    alias: { re2js: fileURLToPath(new URL("./src/stubs/re2js.ts", import.meta.url)) },
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    lessonMeta(),
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
