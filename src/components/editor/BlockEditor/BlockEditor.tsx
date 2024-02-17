"use client";

import { type Content, type Editor, EditorContent } from "@tiptap/react";
import React, { useEffect, useRef } from "react";

import { ContentItemMenu, LinkMenu } from "~/components/editor/menus";

import ImageBlockMenu from "~/components/editor/extensions/ImageBlock/components/ImageBlockMenu";
import { ColumnsMenu } from "~/components/editor/extensions/MultiColumn/menus";
import { TableColumnMenu, TableRowMenu } from "~/components/editor/extensions/Table/menus";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";

export interface BlockEditorProps {
  characterCount: any;
  defaultValue?: Content;
  editor: Editor | null;
  isHeaderVisible?: boolean;
  readonly?: boolean;
}

export const BlockEditor = ({
  characterCount,
  defaultValue,
  editor,
  isHeaderVisible = false,
  readonly = false,
}: BlockEditorProps) => {
  const menuContainerRef = useRef<HTMLDivElement>(null);

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
      <div className="flex h-full w-full" ref={menuContainerRef}>
        <div className="relative flex h-full flex-1 flex-col">
          <EditorContent className="flex-1 overflow-y-auto" editor={editor} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full" ref={menuContainerRef}>
      <div className="relative flex h-full flex-1 flex-col">
        {isHeaderVisible && (
          <EditorHeader characters={characterCount.characters()} words={characterCount.words()} />
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
