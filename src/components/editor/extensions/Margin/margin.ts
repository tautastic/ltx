import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    margin: {
      setMargin: (margin: string) => ReturnType;
      unsetMargin: () => ReturnType;
    };
  }
}

export const Margin = Extension.create({
  name: "margin",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          class: {},
        },
      },
      {
        types: this.options.types,
        attributes: {
          margin: {
            parseHTML: (element) => element.style.margin.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.margin) {
                return {};
              }

              return {
                style: `margin: ${attributes.margin}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setMargin:
        (margin: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { margin }).run(),
      unsetMargin:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { margin: null }).removeEmptyTextStyle().run(),
    };
  },
});

export default Margin;
