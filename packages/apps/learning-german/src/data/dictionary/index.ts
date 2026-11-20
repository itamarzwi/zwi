/**
 * Entry point of the lazily loaded dictionary chunk. App code reaches it only via
 * `import("#/data/dictionary/index.ts")` (see `useVocab`), so the words never land in the
 * main bundle. Types can be imported from here freely; they're erased at build time.
 */
export { type BuiltinList, builtinLists } from "./lists.ts";
export { type BuiltinWordId, builtinWords } from "./words.ts";
