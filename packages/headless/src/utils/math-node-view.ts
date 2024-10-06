import "mathjax-full/js/input/tex/base/BaseConfiguration";
import "mathjax-full/js/input/tex/ams/AmsConfiguration";
import { type InputRule, type NodeConfig, type NodeViewRenderer, type PasteRule, mergeAttributes } from "@tiptap/core";
import type { NodeType } from "@tiptap/pm/model";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { TeX } from "mathjax-full/js/input/tex";
import { mathjax } from "mathjax-full/js/mathjax";
import { SVG } from "mathjax-full/js/output/svg";

RegisterHTMLHandler(liteAdaptor());
const html = mathjax.document("", {
  InputJax: new TeX({ packages: ["base", "ams"] }),
  OutputJax: new SVG({ fontCache: "local" }),
});

const renderSvg = (dom: HTMLElement, latex: string, display: boolean) => {
  const node = html.convert(latex, { display });
  const containerStyle = html.adaptor.getAttribute(node, "style");
  html.adaptor.setAttribute(html.adaptor.firstChild(node), "aria-hidden", "true");
  if (containerStyle) {
    dom.setAttribute("style", containerStyle);
  }
  dom.innerHTML = html.adaptor.innerHTML(node);
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

export const parseMathNodeHTML: ({ isDisplay }: { isDisplay: boolean }) => NodeConfig["parseHTML"] =
  ({ isDisplay }) =>
  () => {
    return [
      {
        tag: `mjx-container[role='math'][display='${isDisplay}']`,
        getAttrs: (element) => ({ latex: element.getAttribute("aria-label") }),
      },
    ];
  };

export const renderMathNodeHTML: ({ isDisplay }: { isDisplay: boolean }) => NodeConfig["renderHTML"] =
  ({ isDisplay }) =>
  ({ node, HTMLAttributes }) => {
    const attributes = mergeAttributes(HTMLAttributes, {
      "aria-label": node.attrs.latex,
      display: isDisplay,
      role: "math",
    });
    return ["mjx-container", attributes];
  };

export const addMathNodeView: ({ isDisplay }: { isDisplay: boolean }) => NodeViewRenderer =
  ({ isDisplay }) =>
  ({ node, editor }) => {
    const isEditable = editor.isEditable;
    const dom = document.createElement("mjx-container");
    dom.className = "MathJax Tiptap-mathematics-render";
    dom.setAttribute("data-is-editable", isEditable.toString());
    dom.setAttribute("data-editor-open", "false");
    dom.setAttribute("display", isDisplay.toString());
    dom.setAttribute("role", "math");
    dom.setAttribute("jax", "SVG");

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
      renderSvg(dom, latex, isDisplay);
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

export const addMathNodeInputRules: (props: {
  nodeType: NodeType;
  isDisplay: boolean;
}) => InputRule[] = ({ nodeType, isDisplay }) => {
  const find = isDisplay ? /(?:^|\s)\$\$([^$]+)\$\$\s/ : /(?:^|\s)\$([^$]+)\$\s/;

  const handler: typeof InputRule.prototype.handler = ({ state, range, match }) => {
    const { from, to } = range;
    const content = match[1];
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
  const find = isDisplay ? /(?:^|\s)\$\$([^$]+)\$\$(?:$|\s)/g : /(?:^|\s)\$([^$]+)\$(?:$|\s)/g;

  const handler: typeof PasteRule.prototype.handler = ({ state, range, match }) => {
    const { from, to } = range;
    const content = match[1];
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
