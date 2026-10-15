import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { cn } from "#/lib/utils.ts";

/** Lets wide lesson tables scroll sideways on phones instead of breaking the page layout. */
export function ScrollableTable(props: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

// Static class names so Tailwind can see them. Column 1 is left uncolored on purpose (usually the row label).
const columnTintClasses = [
  "[&_tr>:nth-child(2)]:bg-(--col-2) dark:[&_tr>:nth-child(2)]:bg-(--col-2-dark)",
  "[&_tr>:nth-child(3)]:bg-(--col-3) dark:[&_tr>:nth-child(3)]:bg-(--col-3-dark)",
  "[&_tr>:nth-child(4)]:bg-(--col-4) dark:[&_tr>:nth-child(4)]:bg-(--col-4-dark)",
  "[&_tr>:nth-child(5)]:bg-(--col-5) dark:[&_tr>:nth-child(5)]:bg-(--col-5-dark)",
  "[&_tr>:nth-child(6)]:bg-(--col-6) dark:[&_tr>:nth-child(6)]:bg-(--col-6-dark)",
];

type ColumnColor = { light: string; dark: string };

/**
 * Wrap a markdown table in <GridTable> for a table with a border and a line between every row and every column.
 * Leave a blank line between the tags and the table.
 * `columnColors` tints whole columns by index (0 = first column) with one color per theme, e.g.
 * [undefined, { light: "#CCD6DD", dark: "#26343F" }] tints the second column. Supports the first 6 columns.
 */
export function GridTable({
  children,
  columnColors = [],
}: {
  children: ReactNode;
  columnColors?: (ColumnColor | undefined)[];
}) {
  const style = Object.fromEntries(
    columnColors.flatMap((color, index) =>
      color
        ? [
            [`--col-${index + 1}`, color.light],
            [`--col-${index + 1}-dark`, color.dark],
          ]
        : [],
    ),
  ) as CSSProperties;
  return (
    <div
      style={style}
      className={cn(
        "my-4 border border-foreground/30 [&_td]:border-foreground/30 [&_th]:border-foreground/30 [&_td]:border-b [&_td]:border-l [&_td]:px-1 [&_th]:border-b [&_th]:border-l [&_th]:px-1",
        "[&_td:first-child]:border-l-0 [&_th:first-child]:border-l-0 [&_tr:last-child_td]:border-b-0",
        columnTintClasses.filter((_, index) => columnColors[index + 1]),
      )}
    >
      {children}
    </div>
  );
}
