import { EditorContent, type EditorContentProps, useEditor } from "@tiptap/react";
import { type JSX, type RefAttributes } from "react";
import "katex/dist/katex.min.css";
import StarterKit from "@tiptap/starter-kit";
import Mathematics from "@tiptap-pro/extension-mathematics";
import { defaultValue } from "~/lib/types";

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Mathematics],
    injectCSS: false,
    content: defaultValue,
    editorProps: {
      attributes: {
        class: "p-6 sm:p-14",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      className={
        "prose-sm break-words rounded-md bg-gray-50 text-black outline-none dark:prose-invert md:prose-base prose-headings:mb-2 dark:bg-gray-950 dark:text-gray-100"
      }
      editor={editor}
    />
  );
};

export default Editor;
