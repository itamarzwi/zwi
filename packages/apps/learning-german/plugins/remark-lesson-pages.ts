type MdNode = {
  type: string;
  depth?: number;
  value?: string;
  name?: string;
  attributes?: unknown[];
  children?: MdNode[];
};

const textOf = (node: MdNode): string => node.value ?? (node.children ?? []).map(textOf).join("");

const jsx = (name: string, attributes: unknown[], children: MdNode[]): MdNode => ({
  type: "mdxJsxFlowElement",
  name,
  attributes,
  children,
});

/**
 * Wraps a lesson's content in <LessonPages>, with one <LessonPage title="..."> per `##` section.
 * Content before the first `##` joins the first page. ESM exports (like `meta`) stay at the top.
 */
export const remarkLessonPages = () => (tree: MdNode) => {
  const children = tree.children ?? [];
  const esm = children.filter((node) => node.type === "mdxjsEsm");
  const pages: { title: string; nodes: MdNode[] }[] = [];
  const intro: MdNode[] = [];

  for (const node of children.filter((n) => n.type !== "mdxjsEsm")) {
    if (node.type === "heading" && node.depth === 2) {
      pages.push({ title: textOf(node), nodes: [node] });
    } else if (pages.length === 0) {
      intro.push(node);
    } else {
      pages[pages.length - 1].nodes.push(node);
    }
  }

  if (pages.length === 0) pages.push({ title: "", nodes: [] });
  pages[0].nodes.unshift(...intro);

  tree.children = [
    ...esm,
    jsx(
      "LessonPages",
      [],
      pages.map((page) => jsx("LessonPage", [{ type: "mdxJsxAttribute", name: "title", value: page.title }], page.nodes)),
    ),
  ];
};
