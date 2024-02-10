"use client";

import { type Content, EditorContent } from "@tiptap/react";
import React, { useEffect, useRef } from "react";

import { LinkMenu } from "~/components/editor/menus";

import { useBlockEditor } from "~/lib/hooks/useBlockEditor";

import { Sidebar } from "~/components/editor/Sidebar";
import ImageBlockMenu from "~/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "~/components/editor/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "~/components/editor/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "~/components/editor/menus";

export interface BlockEditorProps {
  containerRef?: React.RefObject<HTMLDivElement>;
  defaultValue?: Content;
  isHeaderVisible?: boolean;
}

export const BlockEditor = ({
  containerRef,
  defaultValue,
  isHeaderVisible = true,
}: BlockEditorProps) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const { editor, characterCount, leftSidebar } = useBlockEditor();

  useEffect(() => {
    if (editor && defaultValue) {
      editor.chain().setContent(defaultValue).run();
      if (containerRef && containerRef.current !== null) {
        containerRef.current.style.opacity = "1";
      }
      return () => editor.chain().clearContent(true).run();
    }
    return () => {};
  }, [containerRef, defaultValue, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      {isHeaderVisible && (
        <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      )}
      <div className="relative flex h-full flex-1 flex-col">
        {isHeaderVisible && (
          <EditorHeader
            characters={characterCount.characters()}
            words={characterCount.words()}
            isSidebarOpen={leftSidebar.isOpen}
            toggleSidebar={leftSidebar.toggle}
          />
        )}
        <EditorContent className="flex-1 overflow-y-auto" editor={editor} />
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
