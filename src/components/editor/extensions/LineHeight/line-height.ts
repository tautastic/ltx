import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (height: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          class: {},
        },
      },
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            parseHTML: (element) => element.style.lineHeight.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {};
              }

              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { lineHeight }).run(),
      unsetLineHeight:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { lineHeight: null }).removeEmptyTextStyle().run(),
    };
  },
});

export default LineHeight;
