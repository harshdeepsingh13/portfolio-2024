import { Node, mergeAttributes } from "@tiptap/core";

export const ChipExtension = Node.create({
  name: "chip",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span.tiptap-chip",
        getAttrs: (dom) => ({ label: (dom as HTMLElement).textContent }),
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { class: "tiptap-chip" }),
      node.attrs.label,
    ];
  },
});
