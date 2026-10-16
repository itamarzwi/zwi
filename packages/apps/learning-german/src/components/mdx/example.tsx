import { createContext, type ReactNode, useContext } from "react";

const InExampleListContext = createContext(false);

const colorClasses = {
  verb: "text-rose-700 dark:text-rose-300",
  noun: "text-blue-700 dark:text-blue-300",
  adjective: "text-amber-700 dark:text-amber-300",
  adverb: "text-teal-700 dark:text-teal-300",
  timeplace: "text-violet-700 dark:text-violet-300",
  // Case colors (Nominativ/Akkusativ), not word classes.
  green: "text-green-700 dark:text-green-400",
  blue: "text-blue-700 dark:text-blue-400",
} as const;

/**
 * Renders light markup in a plain string: `**bold**`, `*italic*` (or `_italic_`) and `verb(...)`, `noun(...)`, `adjective(...)`, `adverb(...)`, `timeplace(...)` (bold coloured word classes), plus `green(...)`/`blue(...)` for cases.
 * Nesting is not supported.
 */
const renderRich = (text: string) =>
  text.split(/(\*\*.+?\*\*|\*[^*]+\*|_[^_]+_|(?:verb|noun|adjective|adverb|timeplace|green|blue)\(.+?\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const italic = part.match(/^\*([^*]+)\*$|^_([^_]+)_$/);
    if (italic) return <em key={i}>{italic[1] ?? italic[2]}</em>;
    const colored = part.match(/^(verb|noun|adjective|adverb|timeplace|green|blue)\((.+)\)$/);
    if (colored) {
      return (
        <strong key={i} className={colorClasses[colored[1] as keyof typeof colorClasses]}>
          {colored[2]}
        </strong>
      );
    }
    return part;
  });

/** A German sentence with its English translation; `**word**` is bolded, `*word*` is italic and `verb(word)` is bold and coloured. Usage: <Example de="Ich heiße **Anna**." en="My name is **Anna**." /> */
export function Example({ de, en, note }: { de: string; en: string; note?: ReactNode }) {
  const inList = useContext(InExampleListContext);
  return (
    <div className={inList ? "px-4 py-3" : "not-prose my-3 rounded-xl border bg-card px-4 py-3"}>
      <p className="font-medium">{renderRich(de)}</p>
      <p className="text-sm text-muted-foreground">{renderRich(en)}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

/** One card holding several <Example>s separated by thin dividers. */
export function ExampleList({ children }: { children: ReactNode }) {
  return (
    <InExampleListContext.Provider value={true}>
      <div className="not-prose my-3 divide-y overflow-hidden rounded-xl border bg-card">{children}</div>
    </InExampleListContext.Provider>
  );
}
