import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    horizontalMargin: {
      setHorizontalMargin: (horizontalMargin: string) => ReturnType;
      unsetHorizontalMargin: () => ReturnType;
    };
    verticalMargin: {
      setVerticalMargin: (verticalMargin: string) => ReturnType;
      unsetVerticalMargin: () => ReturnType;
    };
  }
}

export const Margin = Extension.create({
  name: "margin",

  addOptions() {
    return {
      types: ["divStyle"],
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
          horizontalMargin: {
            parseHTML: (element) => element.style.margin.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.horizontalMargin) {
                return {};
              }

              return {
                style: `margin-left: ${attributes.horizontalMargin}; margin-right: ${attributes.horizontalMargin}`,
              };
            },
          },
          verticalMargin: {
            parseHTML: (element) => element.style.margin.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.verticalMargin) {
                return {};
              }

              return {
                style: `margin-top: ${attributes.verticalMargin}; margin-bottom: ${attributes.verticalMargin}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setHorizontalMargin:
        (horizontalMargin: string) =>
        ({ chain }) =>
          chain().setMark("divStyle", { horizontalMargin }).run(),
      unsetHorizontalMargin:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("divStyle", { horizontalMargin: null })
            .removeEmptyDivStyle()
            .run();
        },
      setVerticalMargin:
        (verticalMargin: string) =>
        ({ chain }) =>
          chain().setMark("divStyle", { verticalMargin }).run(),
      unsetVerticalMargin:
        () =>
        ({ chain }) =>
          chain().setMark("divStyle", { verticalMargin: null }).removeEmptyDivStyle().run(),
    };
  },
});

export default Margin;
