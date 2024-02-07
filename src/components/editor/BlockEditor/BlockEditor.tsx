"use client";

import { EditorContent } from "@tiptap/react";
import React, { useRef } from "react";

import { LinkMenu } from "~/components/editor/menus";

import { useBlockEditor } from "~/lib/hooks/useBlockEditor";

import { Sidebar } from "~/components/editor/Sidebar";
import ImageBlockMenu from "~/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "~/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "~/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { ContentItemMenu } from "~/components/editor/menus";

export const BlockEditor = () => {
  const menuContainerRef = useRef(null);

  const { editor, characterCount, leftSidebar } = useBlockEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex h-full flex-1 flex-col overflow-hidden">
        <EditorHeader
          characters={characterCount.characters()}
          words={characterCount.words()}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
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
