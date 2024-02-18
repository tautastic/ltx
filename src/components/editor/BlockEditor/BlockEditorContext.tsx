import { type EditorOptions } from "@tiptap/core";
import { createContext, type ReactNode, useContext } from "react";
import { type Editor, useEditor } from "@tiptap/react";
import ExtensionKit from "~/components/editor/extensions/extension-kit";

export type BlockEditorContextValue = {
  editor: Editor | null;
};

export const BlockEditorContext = createContext<BlockEditorContextValue>({
  editor: null,
});

export const BlockEditorConsumer = BlockEditorContext.Consumer;

export const useBlockEditor = () => useContext(BlockEditorContext);

export type BlockEditorProviderProps = {
  children: ReactNode;
} & Partial<EditorOptions>;

export const BlockEditorProvider = ({ children, ...editorOptions }: BlockEditorProviderProps) => {
  const editor = useEditor({
    extensions: [...ExtensionKit()],
    ...editorOptions,
  });

  if (!editor) {
    return null;
  }

  return <BlockEditorContext.Provider value={{ editor }}>{children}</BlockEditorContext.Provider>;
};
