"use client";

import { type Content, EditorContent } from "@tiptap/react";
import { useEffect, useRef } from "react";

import { ContentItemMenu, LinkMenu } from "~/components/editor/menus";

import { useBlockEditor } from "~/lib/hooks/useBlockEditor";

import { Sidebar } from "~/components/editor/Sidebar";
import ImageBlockMenu from "~/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "~/components/editor/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "~/components/editor/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { cn } from "~/utils/cn";

export interface BlockEditorProps {
  className?: string;
  defaultValue?: Content;
  isHeaderVisible?: boolean;
  readonly?: boolean;
}

export const BlockEditor = ({
  className,
  defaultValue,
  isHeaderVisible = true,
  readonly = false,
}: BlockEditorProps) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const { editor, characterCount, leftSidebar } = useBlockEditor();

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

  if (readonly) {
    return (
      <div className="flex w-full" ref={menuContainerRef}>
        <div className="relative flex flex-1 flex-col">
          <EditorContent className="flex-1 overflow-y-auto" editor={editor} />
        </div>
      </div>
    );
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
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  );
};

export default BlockEditor;
