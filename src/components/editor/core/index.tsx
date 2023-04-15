import { type CreateReactNodeView, useNodeViewFactory } from "@prosemirror-adapter/react";
import { defaultValueCtx, Editor, editorViewOptionsCtx, rootCtx } from "@milkdown/core";
import { history, historyKeymap } from "@milkdown/plugin-history";
import { math, mathBlockSchema } from "@milkdown/plugin-math";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor } from "@milkdown/react";
import { type FC, useEffect } from "react";
import { $view } from "@milkdown/utils";
import "katex/dist/katex.min.css";

import MathblockReadonly from "~/components/editor/core/mathblock-readonly";
import Mathblock from "~/components/editor/core/mathblock";
import twcx from "~/utils/twcx";

const createEditor = (
  root: HTMLElement,
  placeholder: string,
  readOnly: boolean,
  nodeViewFactory: CreateReactNodeView
) => {
  return Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root);
      ctx.set(defaultValueCtx, placeholder);
      ctx.set(historyKeymap.key, {
        Undo: "Ctrl-z",
        Redo: "Ctrl-y",
      });
      ctx.update(editorViewOptionsCtx, (prev) => {
        const prevClass = prev.attributes;
        return {
          ...prev,
          editable: () => !readOnly,
          attributes: (state) => {
            const attrs = typeof prevClass === "function" ? prevClass(state) : prevClass;
            return {
              ...attrs,
              class: twcx(
                "milkdown-theme-ltx prose outline-none prose-sm mx-auto max-w-[90ch] rounded-md bg-gray-50 p-6 text-black dark:prose-invert md:prose-base prose-headings:mb-2 dark:bg-gray-950 dark:text-gray-100 sm:my-14 sm:max-w-[70ch] sm:p-14 md:max-w-[75ch] lg:max-w-[95ch]",
                attrs?.class || ""
              ),
            };
          },
        };
      });
    })
    .use(commonmark)
    .use(history)
    .use(
      [
        $view(mathBlockSchema.node, () =>
          nodeViewFactory({
            component: (props) =>
              readOnly ? <MathblockReadonly {...props} /> : <Mathblock {...props} />,
            stopEvent: () => true,
          })
        ),
        math,
      ].flat()
    );
};

const EditorCore: FC<{
  defaultValue: string;
  readOnly: boolean;
}> = ({ defaultValue, readOnly }) => {
  const nodeViewFactory = useNodeViewFactory();
  const editorInfo = useEditor(
    (root) => {
      return createEditor(root, defaultValue, readOnly, nodeViewFactory);
    },
    [defaultValue, readOnly, nodeViewFactory]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      const effect = async () => {
        const editor = editorInfo.get();
        if (!editor) return;

        await editor.create();
      };

      effect().catch((e) => {
        console.error(e);
      });
    });
  }, [editorInfo]);

  return <Milkdown />;
};

export default EditorCore;
