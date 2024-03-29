"use client";

import { type Content, EditorContent } from "@tiptap/react";
import { memo, useEffect, useRef } from "react";

import { ContentItemMenu, LinkMenu } from "~/components/editor/menus";

import { Sidebar } from "~/components/editor/Sidebar";
import ImageBlockMenu from "~/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "~/components/editor/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "~/components/editor/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { cn } from "~/utils/cn";
import { useSidebar } from "~/lib/hooks/useSidebar";
import { useBlockEditor } from "~/components/editor/BlockEditor/BlockEditorContext";

export interface BlockEditorProps {
  className?: string;
  defaultValue?: Content;
  isHeaderVisible?: boolean;
  readonly?: boolean;
}

export const BlockEditor = memo(
  ({ className, defaultValue, isHeaderVisible = true, readonly = false }: BlockEditorProps) => {
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const { editor } = useBlockEditor();
    const leftSidebar = useSidebar();
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    };

    useEffect(() => {
      if (!editor) {
        return () => {};
      }

      editor.setEditable(!readonly);

      if (defaultValue) {
        editor.chain().setContent(defaultValue).run();
      }

      return () => editor.chain().clearContent(true).run();
    }, [defaultValue, editor, readonly]);

    if (!editor) {
      return null;
    }

    return (
      <div className="flex w-full" ref={menuContainerRef}>
        {isHeaderVisible && (
          <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
        )}
        <div className="relative flex flex-1 flex-col">
          {isHeaderVisible && (
            <EditorHeader
              characters={characterCount.characters()}
              words={characterCount.words()}
              isSidebarOpen={leftSidebar.isOpen}
              toggleSidebar={leftSidebar.toggle}
            />
          )}
          <EditorContent className={cn("flex-1 overflow-y-auto", className)} editor={editor} />
          {!readonly && (
            <>
              <ContentItemMenu editor={editor} />
              <LinkMenu editor={editor} appendTo={menuContainerRef} />
              <TextMenu editor={editor} />
              <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
              <TableRowMenu editor={editor} appendTo={menuContainerRef} />
              <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
              <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
            </>
          )}
        </div>
      </div>
    );
  }
);

BlockEditor.displayName = "BlockEditor";

export default BlockEditor;
