import { createContext, type ReactNode, useContext } from "react";

const InExampleListContext = createContext(false);

const colorClasses = {
  verb: "text-rose-700 dark:text-rose-300",
  noun: "text-blue-700 dark:text-blue-300",
  adjective: "text-amber-700 dark:text-amber-300",
  possessive: "text-fuchsia-700 dark:text-fuchsia-300",
  adverb: "text-teal-700 dark:text-teal-300",
  timeplace: "text-violet-700 dark:text-violet-300",
  // Case colors (Nominativ/Akkusativ), not word classes.
  green: "text-green-700 dark:text-green-400",
  blue: "text-blue-700 dark:text-blue-400",
} as const;

const colorNames = Object.keys(colorClasses).join("|");
const markupStart = new RegExp(`\\*\\*.+?\\*\\*|\\*[^*]+\\*|_[^_]+_|(${colorNames})\\(`, "g");

/** Index of the `)` closing the `(` just before `from`, or -1. */
const findClose = (text: string, from: number) => {
  let depth = 1;
  for (let i = from; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return i;
  }
  return -1;
};

/**
 * Renders light markup in a plain string: `**bold**`, `*italic*` (or `_italic_`) and `verb(...)`, `noun(...)`, `adjective(...)`, `possessive(...)`, `adverb(...)`, `timeplace(...)` (bold coloured word classes), plus `green(...)`/`blue(...)` for cases.
 * Coloured markup can be nested, e.g. `green(Der adjective(große) Hund)`; the inner colour wins.
 */
const renderRich = (text: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let pos = 0;
  for (const m of text.matchAll(markupStart)) {
    if (m.index < pos) continue;
    const color = m[1] as keyof typeof colorClasses | undefined;
    if (color) {
      const start = m.index + m[0].length;
      const end = findClose(text, start);
      if (end === -1) continue;
      out.push(text.slice(pos, m.index));
      out.push(
        <strong key={m.index} className={colorClasses[color]}>
          {renderRich(text.slice(start, end))}
        </strong>,
      );
      pos = end + 1;
      continue;
    }
    const bold = m[0].match(/^\*\*(.+)\*\*$/);
    const italic = m[0].match(/^\*([^*]+)\*$|^_([^_]+)_$/);
    if (bold) {
      out.push(text.slice(pos, m.index), <strong key={m.index}>{bold[1]}</strong>);
    } else if (italic) {
      out.push(text.slice(pos, m.index), <em key={m.index}>{italic[1] ?? italic[2]}</em>);
    } else continue;
    pos = m.index + m[0].length;
  }
  out.push(text.slice(pos));
  return out;
};

type ExampleProps = ({ de: string; en?: string } | { de?: string; en: string }) & { note?: ReactNode };

/** A German sentence with its English translation; either one may be left out. `**word**` is bolded, `*word*` is italic and `verb(word)` is bold and coloured. Usage: <Example de="Ich heiße **Anna**." en="My name is **Anna**." /> */
export function Example({ de, en, note }: ExampleProps) {
  const inList = useContext(InExampleListContext);
  return (
    <div className={inList ? "px-4 py-3" : "not-prose my-3 rounded-xl border bg-card px-4 py-3"}>
      {de && <p className="font-medium">{renderRich(de)}</p>}
      {en && <p className={de ? "text-sm text-muted-foreground" : "font-medium"}>{renderRich(en)}</p>}
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
