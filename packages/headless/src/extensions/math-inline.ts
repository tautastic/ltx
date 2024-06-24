import { Node } from "@tiptap/core";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import type { MarkdownNodeSpec } from "tiptap-markdown";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const html = mathjax.document("", { InputJax: new TeX({ packages: ["base", "ams"] }), OutputJax: new SVG() });

const updateCss = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const styleContainer = (html.outputJax as any).svgStyles;
  const value = styleContainer.children[0].value;
  const id = styleContainer.attributes.id;

  let styleElement = document.getElementById(id);

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = id;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = value;
};

const buildSvgOutput = (latex: string): string => {
  const svgNode = html.convert(latex, { display: false });
  html.findMath().compile().getMetrics().typeset().updateDocument();
  updateCss();
  return adaptor.innerHTML(svgNode);
};

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
        parseHTML: (element) => element.getAttribute("latex"),
        renderHTML: (attributes) => ({ latex: attributes.latex }),
      },
    };
  },

  addStorage(): { markdown: MarkdownNodeSpec } {
    return {
      markdown: {
        serialize(state, node) {
          state.write(`$${node.attrs.latex}$`);
          state.text(node.textContent, true);
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
    return ({ node }) => {
      const dom = document.createElement("span");
      dom.className = "Tiptap-mathematics-render Tiptap-mathematics-render--editable";
      dom.setAttribute("data-editor-open", "false");
      dom.contentEditable = "false";

      const input = document.createElement("span");
      input.className = "Tiptap-mathematics-editor";
      input.contentEditable = "true";

      const renderMath = (latex: string | undefined = node.attrs.latex) => {
        dom.setAttribute("latex", latex);
        input.textContent = latex;
        dom.innerHTML = buildSvgOutput(latex);
        dom.appendChild(input);
      };

      const showEditor = () => {
        dom.setAttribute("data-editor-open", "true");
        input.focus();
        input.textContent = node.attrs.latex;
      };

      const hideEditor = () => {
        dom.setAttribute("data-editor-open", "false");
        renderMath(input.textContent ?? "");
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          hideEditor();
          return;
        }
      });

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
});

export default MathInline;
