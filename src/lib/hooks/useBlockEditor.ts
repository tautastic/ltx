import { type Editor, EditorEvents, useEditor } from "@tiptap/react";

import { ExtensionKit } from "~/components/editor/extensions/extension-kit";
import { useSidebar } from "./useSidebar";
import { placeholders } from "~/lib/types";

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
      onUpdate(props: EditorEvents["update"]): void {
        console.log(props.editor.getJSON());
      },

      onCreate: ({ editor }) => {
        if (editor.isEmpty) {
          editor.commands.setContent(placeholders["de-stochastik"]);
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
