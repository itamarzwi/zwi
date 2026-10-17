import { type ComponentProps, type CSSProperties, Fragment, type ReactNode } from "react";
import { cn } from "#/lib/utils.ts";
import { renderRich } from "./example.tsx";

/** Lets wide lesson tables scroll sideways on phones instead of breaking the page layout. */
export function ScrollableTable(props: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

// Static class names so Tailwind can see them.
const columnTintClasses = [
  "[&_tr>:nth-child(1)]:bg-(--col-1) dark:[&_tr>:nth-child(1)]:bg-(--col-1-dark)",
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
        columnTintClasses.filter((_, index) => columnColors[index]),
      )}
    >
      {children}
    </div>
  );
}

const genderColumnColors: (ColumnColor | undefined)[] = [
  undefined,
  { light: "#CCD6DD", dark: "#2B3D4D" }, // masculine
  { light: "#D6DDCC", dark: "#364529" }, // neuter
  { light: "#DDCCD6", dark: "#4A2D3E" }, // feminine
];

/**
 * A gendered table with fixed, colored columns: masculine, neuter, feminine and optionally plural.
 * Always use this for gendered tables so the gender colors stay consistent. There is no header to write:
 * it is always the gender names. Pass `label` (even an empty string) to get a first, uncolored label column,
 * and leave it out for no first column. Rows with 3 gender cells have no plural column, rows with 4 do.
 * Cells take the same light markup as <Example> (`**bold**`, `*italic*`) and "\n" starts a new line inside a cell.
 * Usage: <GenderedTable label="Case" rows={[["Nom.", "der", "das", "die", "die"]]} />
 */
export function GenderedTable({ label, rows }: { label?: string; rows: string[][] }) {
  const hasLabel = label !== undefined;
  const genders = ["masculine", "neuter", "feminine", ...(rows[0].length - (hasLabel ? 1 : 0) > 3 ? ["plural"] : [])];
  const headers = hasLabel ? [label, ...genders] : genders;
  return (
    <GridTable columnColors={hasLabel ? genderColumnColors : genderColumnColors.slice(1)}>
      <ScrollableTable>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, index) => (
                <td key={index}>
                  {cell.split("\n").map((line, lineIndex) => (
                    <Fragment key={lineIndex}>
                      {lineIndex > 0 && <br />}
                      {renderRich(line)}
                    </Fragment>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </ScrollableTable>
    </GridTable>
  );
}
