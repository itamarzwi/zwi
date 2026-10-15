# Project rules

## shadcn

Use the latest version of shadcn to install new components, for example:

```bash
pnpm dlx shadcn@latest add button
```

## Route handlers

Never use try-catch in route handlers. Just let the error get thrown.

## Functions

Always prefer arrow functions unless named functions are required or preferred by a library.

Named functions are required for:

1. Function overloading with TypeScript.
2. Functions that need an external `this` binding.

Named functions are preferred for:

1. React functional components (functions returning JSX in `.tsx` files). These should always be named, NOT arrow.
2. Cache libraries that use function names for keys.

## IDs

IDs are plain strings and may contain any Unicode, including umlauts and ß (e.g. the word id `heißen`, `tschüss`, `fünf`). Never transliterate to ASCII (`heissen`, `tschuess`) just for ids. Keep them NFC-normalized (precomposed characters, which is what editors produce by default). Router params and the database both handle this fine.
