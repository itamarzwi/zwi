import { readFile } from "node:fs/promises";
import type { Plugin } from "vite";

const QUERY = "?meta";
/** The \0 prefix marks a virtual module: the MDX and React plugins skip it, so it stays plain JS. */
const PREFIX = "\0lesson-meta:";
const META = /^export const meta = \{[\s\S]*?^\};/m;

/**
 * Serves `lesson.mdx?meta` as a module with nothing but the lesson's `export const meta = {…};`.
 *
 * The lesson list needs every lesson's title and summary up front, but importing `meta` from the
 * .mdx itself pulls the whole lesson into the main bundle. With this, the registry eagerly imports
 * only the metas, and each lesson's content stays in its own chunk until it's opened.
 */
export const lessonMeta = (): Plugin => ({
  name: "lesson-meta",
  enforce: "pre",
  async resolveId(source, importer) {
    if (!source.endsWith(`.mdx${QUERY}`)) return null;
    const resolved = await this.resolve(source.slice(0, -QUERY.length), importer, { skipSelf: true });
    return resolved && `${PREFIX}${resolved.id}`;
  },
  async load(id) {
    if (!id.startsWith(PREFIX)) return null;
    const file = id.slice(PREFIX.length);
    this.addWatchFile(file);
    const meta = (await readFile(file, "utf8")).match(META);
    if (!meta) this.error(`${file} must start with \`export const meta = { … };\``);
    return meta[0];
  },
});
