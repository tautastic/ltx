import { BubbleMenu, isNodeSelection, useCurrentEditor } from "@tiptap/react";
import type { BubbleMenuProps } from "@tiptap/react";
import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import type { Instance, Props } from "tippy.js";

export interface EditorBubbleProps extends Omit<BubbleMenuProps, "editor"> {
  readonly children: ReactNode;
}

export const EditorBubble = ({ children, tippyOptions, ...rest }: EditorBubbleProps) => {
  const { editor: currentEditor } = useCurrentEditor();
  const instanceRef = useRef<Instance<Props> | null>(null);

  useEffect(() => {
    if (!instanceRef.current || !tippyOptions?.placement) {
      return;
    }

    instanceRef.current.setProps({ placement: tippyOptions.placement });
    instanceRef.current.popperInstance?.update();
  }, [tippyOptions?.placement]);

  const bubbleMenuProps: Omit<Omit<BubbleMenuProps, "children">, "editor"> = useMemo(() => {
    const shouldShow: BubbleMenuProps["shouldShow"] = ({ editor, state }) => {
      const { selection } = state;
      const { empty } = selection;

      // don't show bubble menu if:
      // - the editor is not editable
      // - the selected node is an image
      // - the selection is empty
      // - the selection is a node selection (for drag handles)
      return (
        editor.isEditable &&
        !editor.isActive("image") &&
        !editor.isActive("MathInline") &&
        !editor.isActive("MathBlock") &&
        !empty &&
        !isNodeSelection(selection)
      );
    };

    return {
      shouldShow,
      tippyOptions: {
        onCreate: (val) => {
          instanceRef.current = val;
        },
        moveTransition: "transform 0.15s ease-out",
        ...tippyOptions,
      },
      ...rest,
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  }, [tippyOptions, rest]);

  if (!currentEditor) {
    return null;
  }

  return (
    <BubbleMenu editor={currentEditor} {...bubbleMenuProps}>
      {children}
    </BubbleMenu>
  );
};

EditorBubble.displayName = "EditorBubble";

export default EditorBubble;
