import "mathjax-full/js/input/tex/base/BaseConfiguration";
import "mathjax-full/js/input/tex/ams/AmsConfiguration";
import type { InputRule, NodeConfig, NodeViewRenderer, NodeViewRendererProps, PasteRule } from "@tiptap/core";
import type { NodeType } from "@tiptap/pm/model";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { TeX } from "mathjax-full/js/input/tex";
import { mathjax } from "mathjax-full/js/mathjax";
import { SVG } from "mathjax-full/js/output/svg";
import type { MarkdownNodeSpec } from "tiptap-markdown";

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const html = mathjax.document("", { InputJax: new TeX({ packages: ["base", "ams"] }), OutputJax: new SVG() });

const buildSvgOutput = (latex: string, display: boolean) => {
  const node = html.convert(latex, { display });

  html.findMath().compile().getMetrics().typeset().updateDocument();
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

  return adaptor.innerHTML(node);
};

type MathNodeViewRenderer = (
  props: NodeViewRendererProps & {
    isDisplay: boolean;
  },
) => ReturnType<NodeViewRenderer>;

const addMathNodeViewInternal: MathNodeViewRenderer = ({ node, editor, isDisplay }) => {
  const isEditable = editor.isEditable;
  const dom = document.createElement("mjx-container");
  dom.className = "MathJax Tiptap-mathematics-render";
  dom.setAttribute("data-is-editable", isEditable.toString());
  dom.setAttribute("data-editor-open", "false");
  dom.setAttribute("display", isDisplay.toString());
  dom.setAttribute("role", "math");
  dom.setAttribute("jax", "SVG");
  dom.contentEditable = "false";

  let input: HTMLElement | undefined;

  if (isEditable) {
    input = document.createElement(isDisplay ? "div" : "span");
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
    dom.setAttribute("aria-label", latex);
    dom.innerHTML = buildSvgOutput(latex, isDisplay);
    if (input) {
      input.textContent = latex;
      dom.appendChild(input);
    }
  };

  const showEditor = () => {
    if (input) {
      dom.setAttribute("data-editor-open", "true");
      input.focus();
      input.textContent = dom.getAttribute("aria-label");
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

export const addMathNodeAttributes: NodeConfig["addAttributes"] = () => {
  return {
    latex: {
      default: "",
      renderHTML: (attributes) => {
        return { "aria-label": attributes.latex };
      },
      parseHTML: (element) => {
        return element.getAttribute("aria-label");
      },
    },
  };
};

export const addMathNodeStorage: ({ isDisplay }: { isDisplay: boolean }) => { markdown: MarkdownNodeSpec } = ({
  isDisplay,
}) => {
  const d = isDisplay ? "$$" : "$";
  return {
    markdown: {
      serialize(state, node) {
        state.write(`${d}${node.attrs.latex}${d}`);
      },
    },
  };
};

export const parseMathNodeHTML: NodeConfig["parseHTML"] = () => {
  return [{ tag: "mjx-container[role='math']" }];
};

export const renderMathNodeHTML: NodeConfig["renderHTML"] = ({ node, HTMLAttributes }) => {
  return ["mjx-container", { ...HTMLAttributes, "aria-label": node.attrs.latex }];
};

export const addMathNodeView: ({ isDisplay }: { isDisplay: boolean }) => NodeViewRenderer = ({ isDisplay }) => {
  return (props) => addMathNodeViewInternal({ ...props, isDisplay });
};

export const addMathNodeInputRules: (props: {
  nodeType: NodeType;
  isDisplay: boolean;
}) => InputRule[] = ({ nodeType, isDisplay }) => {
  const find = isDisplay ? /(?:^|\s)(\$\$(.+?)\$\$)(?:$|\s)/ : /(?:^|\s)(\$(.+?)\$)(?:$|\s)/;

  const handler: typeof InputRule.prototype.handler = ({ state, range, match }) => {
    const { from, to } = range;
    const content = match[2];
    const mathNode = nodeType.create({ latex: content });
    const replacement = isDisplay ? [mathNode, state.schema.node("paragraph")] : mathNode;
    state.tr.replaceWith(from, to, replacement);
  };

  return [
    {
      find,
      handler,
    },
  ];
};

export const addMathNodePasteRules: (props: {
  nodeType: NodeType;
  isDisplay: boolean;
}) => PasteRule[] = ({ nodeType, isDisplay }) => {
  const find = isDisplay ? /(?:^|\s?)(\$\$(.+?)\$\$)(?:$|\s?)/g : /(?:^|\s?)(\$(.+?)\$)(?:$|\s?)/g;

  const handler: typeof PasteRule.prototype.handler = ({ state, range, match, pasteEvent }) => {
    pasteEvent?.preventDefault();
    const { from, to } = range;
    const content = match[2];
    const mathNode = nodeType.create({ latex: content });
    const replacement = isDisplay ? [mathNode, state.schema.node("paragraph")] : mathNode;
    state.tr.replaceWith(from, to, replacement);
  };

  return [
    {
      find,
      handler,
    },
  ];
};
