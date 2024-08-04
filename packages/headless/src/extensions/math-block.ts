import { Node } from "@tiptap/core";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { buildSvgOutput } from "../utils/math-utils";
import type { MarkdownNodeSpec } from "tiptap-markdown";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const html = mathjax.document("", { InputJax: new TeX({ packages: ["base", "ams"] }), OutputJax: new SVG() });

const MathBlock = Node.create({
  name: "MathBlock",
  group: "block",
  content: "text*",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("latex"),
        renderHTML: (attributes) => ({ latex: attributes.latex }),
      },
    };
  },

  addStorage(): { markdown: MarkdownNodeSpec } {
    return {
      markdown: {
        serialize(state, node) {
          state.write(`$$${node.attrs.latex}$$`);
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[latex]" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, latex: node.attrs.latex }];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement("div");
      dom.className = "Tiptap-mathematics-render Tiptap-mathematics-render--editable";
      dom.setAttribute("data-editor-open", "false");
      dom.contentEditable = "false";

      let input: HTMLDivElement | undefined;

      if (editor.isEditable) {
        input = document.createElement("div");
        input.className = "Tiptap-mathematics-editor";
        input.contentEditable = "true";
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && e.shiftKey) {
            hideEditor();
            return;
          }
        });
      }

      const renderMath = (latex: string | undefined = node.attrs.latex) => {
        dom.setAttribute("latex", latex);
        dom.innerHTML = buildSvgOutput(html, adaptor, latex, true);
        if (input) {
          input.textContent = latex;
          dom.appendChild(input);
        }
      };

      const showEditor = () => {
        if (input) {
          dom.setAttribute("data-editor-open", "true");
          input.focus();
          input.textContent = node.attrs.latex;
        }
      };

      const hideEditor = () => {
        if (input) {
          dom.setAttribute("data-editor-open", "false");
          renderMath(input?.textContent ?? "");
        }
      };

      renderMath();

      return {
        dom,
        stopEvent: () => true,
        selectNode: showEditor,
        deselectNode: hideEditor,
        update: (updatedNode) => {
          if (updatedNode.attrs.latex !== node.attrs.latex) {
            renderMath(updatedNode.attrs.latex);
          }
          return true;
        },
      };
    };
  },

  addInputRules() {
    return [
      {
        find: /(?:^|\s)((?:\$\$)([^$]+)(?:\$\$))(?:$|\s)/,
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
});

export default MathBlock;
