import { useNodeViewContext } from "@prosemirror-adapter/react";
import { katexOptionsCtx } from "@milkdown/plugin-math";
import { useEffect, useMemo, useRef } from "react";
import { useInstance } from "@milkdown/react";
import type { FC } from "react";
import katex from "katex";

const MathblockReadonly: FC = () => {
  const { node } = useNodeViewContext();
  const code = useMemo(() => node.attrs.value as string, [node.attrs.value]);
  const codePanel = useRef<HTMLDivElement>(null);
  const [loading, getEditor] = useInstance();

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!codePanel.current || loading) return;

      try {
        katex.render(code, codePanel.current, getEditor().ctx.get(katexOptionsCtx.key));
      } catch (e) {
        console.error(e);
      }
    });
  }, [code, getEditor, loading]);

  return <div className="py-3 text-center" contentEditable={false} ref={codePanel} />;
};

export default MathblockReadonly;
