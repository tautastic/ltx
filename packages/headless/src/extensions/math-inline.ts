import "mathjax-full/js/input/tex/base/BaseConfiguration";
import "mathjax-full/js/input/tex/ams/AmsConfiguration";
import { Node } from "@tiptap/core";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { buildSvgOutput } from "../utils/math-utils";
import { NodeSelection } from "@tiptap/pm/state";
import type { MarkdownNodeSpec } from "tiptap-markdown";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const html = mathjax.document("", { InputJax: new TeX({ packages: ["base", "ams"] }), OutputJax: new SVG() });

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mathInline: {
      /**
       * Toggle inline math
       */
      toggleMathInline: () => ReturnType;
    };
  }
}

const MathInline = Node.create({
  name: "MathInline",
  group: "inline",
  content: "text*",
  atom: true,
  inline: true,
  selectable: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => {
          return element.getAttribute("latex");
        },
        renderHTML: (attributes) => {
          return { latex: attributes.latex };
        },
      },
    };
  },

  addStorage(): { markdown: MarkdownNodeSpec } {
    return {
      markdown: {
        serialize(state, node) {
          state.write(`$${node.attrs.latex}$`);
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[latex]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["span", { ...HTMLAttributes, latex: node.attrs.latex }];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement("span");
      dom.className = "Tiptap-mathematics-render";
      dom.setAttribute("data-editor-open", "false");
      dom.contentEditable = "false";

      let input: HTMLSpanElement | undefined;

      if (editor.isEditable) {
        input = document.createElement("span");
        dom.className = "Tiptap-mathematics-render Tiptap-mathematics-render--editable";
        input.className = "Tiptap-mathematics-editor";
        input.contentEditable = "true";
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            hideEditor();
            return;
          }
        });
      }

      const renderMath = () => {
        const latex = node.attrs.latex;
        dom.setAttribute("latex", latex);
        dom.innerHTML = buildSvgOutput(html, adaptor, latex, false);
        if (input) {
          input.textContent = latex;
          dom.appendChild(input);
        }
      };

      const showEditor = () => {
        if (input) {
          dom.setAttribute("data-editor-open", "true");
          input.focus();
          input.textContent = dom.getAttribute("latex");
        }
      };

      const hideEditor = () => {
        if (input) {
          dom.setAttribute("data-editor-open", "false");
          // @ts-expect-error
          node.attrs.latex = input.textContent ?? "";
          renderMath();
        }
      };

      renderMath();

      return {
        dom,
        stopEvent: () => true,
        selectNode: showEditor,
        deselectNode: hideEditor,
      };
    };
  },

  addInputRules() {
    return [
      {
        find: /(?:^|\s)((?:\$)([^$]+)(?:\$))(?:$|\s)/,
        handler: ({ state, range, match }) => {
          const { tr } = state;
          const start = range.from;
          const end = range.to;
          const content = match[2];
          tr.replaceWith(start, end, this.type.create({ latex: content }, [state.schema.text(content ?? "")]));
        },
      },
    ];
  },

  addCommands() {
    return {
      toggleMathInline:
        () =>
        ({ commands, state, dispatch }) => {
          if (!dispatch) {
            return false;
          }
          const { selection, tr } = state;

          if (selection.$from.node().type === this.type) {
            commands.clearNodes();
          } else {
            const node = this.type.create({ latex: "" });
            tr.replaceSelectionWith(node);
            tr.setSelection(new NodeSelection(tr.doc.resolve(selection.from)));
            dispatch(tr);
          }

          return true;
        },
    };
  },
});

export default MathInline;
