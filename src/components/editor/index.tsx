import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { math, mathBlockSchema } from "@milkdown/plugin-math";
import { type MilkdownPlugin } from "@milkdown/ctx";
import { useEffect, useMemo } from "react";
import { $view } from "@milkdown/utils";
import { useNodeViewFactory } from "@prosemirror-adapter/react";

import { MathBlock } from "~/components/editor/mathBlock";
import "katex/dist/katex.min.css";
import twcx from "~/utils/twcx";

interface EditorProps {
  placeholder?: string;
  readOnly?: boolean;
}

export const LTXEditor = ({ placeholder = defaultPlaceholder, readOnly = false }: EditorProps) => {
  const nodeViewFactory = useNodeViewFactory();
  const mathPlugins: MilkdownPlugin[] = useMemo(() => {
    return [
      $view(mathBlockSchema.node, () =>
        nodeViewFactory({
          component: MathBlock,
          stopEvent: () => true,
        })
      ),
      math,
    ].flat();
  }, [nodeViewFactory]);

  const editorInfo = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, placeholder);
      })
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => {
          const prevClass = prev.attributes;
          return {
            ...prev,
            editable: () => readOnly,
            attributes: (state) => {
              const attrs = typeof prevClass === "function" ? prevClass(state) : prevClass;
              return {
                ...attrs,
                "aria-readonly": readOnly ? "true" : "false",
                "class": twcx(
                  "prose group/editor outline-none prose-sm mx-auto max-w-[90ch] rounded-md bg-gray-50 p-6 text-black dark:prose-invert md:prose-base prose-headings:mb-2 dark:bg-gray-950 dark:text-gray-100 sm:my-14 sm:max-w-[70ch] sm:p-14 md:max-w-[75ch] lg:max-w-[95ch]",
                  attrs?.class || ""
                ),
              };
            },
          };
        });
      })
      .use(commonmark);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      const effect = async () => {
        const editor = editorInfo.get();
        if (!editor) return;

        editor.use(mathPlugins);
        await editor.create();
      };

      effect().catch((e) => {
        console.error(e);
      });
    });
  }, [editorInfo, mathPlugins]);

  return <Milkdown />;
};

const defaultPlaceholder = `Es sei $\\Omega = \\sum_{n \\in \\N} A_{n}$ eine Zerlegung des Grundraums $\\Omega$ in paarweise disjunkte Mengen $A_{1}, A_{2},\\dotsc\\,$. Zeigen Sie, dass das System
$$
\\mathcal{A} = \\left\\{B \\subseteq \\Omega \\vert \\exists T \\subseteq \\N \\,\\text{mit}\\, B = \\sum_{n \\in T} A_{n} \\right\\}
$$
eine $\\sigma$-Algebra ist.

_Beweis_. Um zu zeigen, dass $\\mathcal{A}$ eine $\\sigma$-Algebra ist, müssen wir zeigen, dass die leere Menge $\\emptyset$ in $\\mathcal{A}$ enthalten ist und dass $\\mathcal{A}$ die Eigenschaften des Komplements und der Vereinigung abzählbarer Mengen besitzt.

1. Die leere Menge ist in $\\mathcal{A}$ enthalten, da sie sich als Vereinigung leerer Mengen darstellen lässt. Denn $\\emptyset = \\sum_{n \\in \\emptyset} A_n$, also gehört $\\emptyset$ zu $\\mathcal{A}$.
1. Für jedes $B \\in \\mathcal{A}$ gibt es eine Menge $T \\subseteq \\N$ mit $B = \\sum_{n \\in T} A_n$. Dann ist das Komplement von $B$ gegeben durch $B^c = \\Omega \\setminus B = \\sum_{n \\in \\N \\setminus T} A_n$, also gehört auch das Komplement von $B$ zu $\\mathcal{A}$.
1. Schließlich betrachten wir eine abzählbare Familie $(B_i){i \\in I}$ von Mengen in $\\mathcal{A}$. Für jedes $i \\in I$ gibt es eine Menge $T_i \\subseteq \\N$ mit $B_i = \\sum_{n \\in T_i} A_n$. Dann ist die Vereinigung der Mengen $B_i$ gegeben durch
   $$
   \\bigcup_{i \\in I} B_i = \\sum_{i \\in I} \\sum_{n \\in T_i} A_n = \\sum_{n \\in \\bigcup_{i \\in I} T_i} A_n,
   $$
   also gehört auch die Vereinigung der Mengen $B_i$ zu $\\mathcal{A}$.

Da $\\mathcal{A}$ die Eigenschaften der leeren Menge, des Komplements und der Vereinigung abzählbarer Mengen besitzt, ist es eine $\\sigma$-Algebra.

$\\blacksquare$
`;
