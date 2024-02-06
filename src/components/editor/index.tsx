import { EditorContent, type EditorContentProps } from "@tiptap/react";
import { type JSX, type RefAttributes } from "react";
import "katex/dist/katex.min.css";

type EditorParams = JSX.IntrinsicAttributes &
  Omit<EditorContentProps, "ref"> &
  RefAttributes<HTMLDivElement>;

const Editor = ({ ...props }: EditorParams) => {
  if (!props.editor) {
    return null;
  }

  return <EditorContent {...props} />;
};

export default Editor;
