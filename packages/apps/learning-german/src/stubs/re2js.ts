/**
 * Stand-in for the `re2js` package (aliased in vite.config.ts). Firestore bundles it for the
 * regex functions of its Pipelines API (regex_match, regex_contains), and imports it as a side
 * effect so it can't be tree-shaken: 147 KB we'd ship for a feature we don't use.
 * If anything does end up calling it, fail loudly instead of silently.
 */
export const RE2JS = {
  compile: () => {
    throw new Error(
      "re2js is stubbed out (see src/stubs/re2js.ts); remove the alias to use Firestore pipeline regexes.",
    );
  },
};
