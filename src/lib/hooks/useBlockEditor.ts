import { type Editor, useEditor } from "@tiptap/react";

import { ExtensionKit } from "~/components/editor/extensions/extension-kit";

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = () => {
  const editor = useEditor(
    {
      autofocus: true,
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

  return { editor, characterCount };
};
