import { visit } from "unist-util-visit";

export const codeMetaPlugin = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data && node.data.meta) {
        node.properties.metastring = node.data.meta;
      }
    });
  };
};
