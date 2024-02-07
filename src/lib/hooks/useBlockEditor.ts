import { type Editor, useEditor } from "@tiptap/react";

import { ExtensionKit } from "~/extensions/extension-kit";
import { useSidebar } from "./useSidebar";
import { defaultValue } from "~/lib/types";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = () => {
  const leftSidebar = useSidebar();

  const editor = useEditor(
    {
      autofocus: true,
      onUpdate: ({ editor, transaction }) => {
        console.log(editor.getJSON());
      },
      onCreate: ({ editor }) => {
        if (editor.isEmpty) {
          editor.commands.setContent(defaultValue);
        }
      },
      extensions: [
        ...ExtensionKit("123"), // TODO: Fix this
      ],
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          class: "min-h-full",
        },
      },
    },
    []
  );

  const characterCount = editor?.storage.characterCount || { characters: () => 0, words: () => 0 };

  return { editor, characterCount, leftSidebar };
};
