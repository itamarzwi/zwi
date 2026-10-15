import type { ComponentProps } from "react";

/** Lets wide lesson tables scroll sideways on phones instead of breaking the page layout. */
export function ScrollableTable(props: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}
