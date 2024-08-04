import type { LiteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import type { MathDocument } from "mathjax-full/js/core/MathDocument";

export const updateCss = (html: MathDocument<unknown, unknown, unknown>) => {
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

export const buildSvgOutput = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  html: MathDocument<any, unknown, unknown>,
  adaptor: LiteAdaptor,
  latex: string,
  display: boolean,
): string => {
  const svgNode = html.convert(latex, { display });
  html.findMath().compile().getMetrics().typeset().updateDocument();
  updateCss(html);
  return adaptor.innerHTML(svgNode);
};
