"use client";

import { type Editor as CoreEditor } from "@tiptap/core";
import { memo, useEffect, useState } from "react";
import { type TableOfContentsStorage } from "@tiptap-pro/extension-table-of-contents";
import twcx from "~/utils/twcx";

export type TableOfContentsProps = {
  editor: CoreEditor;
  onItemClick?: () => void;
};

export const TableOfContents = memo(({ editor, onItemClick }: TableOfContentsProps) => {
  const [data, setData] = useState<TableOfContentsStorage | null>(null);

  useEffect(() => {
    const handler = ({ editor: currentEditor }: { editor: CoreEditor }) => {
      setData({ ...currentEditor.extensionStorage.tableOfContents });
    };

    handler({ editor });

    editor.on("update", handler);
    editor.on("selectionUpdate", handler);

    return () => {
      editor.off("update", handler);
      editor.off("selectionUpdate", handler);
    };
  }, [editor]);

  return (
    <>
      <div className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
        Table of contents
      </div>
      {data && data.content.length > 0 ? (
        <div className="flex flex-col gap-1">
          {data.content.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ marginLeft: `${1 * item.level - 1}rem` }}
              onClick={onItemClick}
              className={twcx(
                "block w-full truncate rounded bg-opacity-10 p-1 text-sm font-medium text-gray-500 transition-all hover:bg-black hover:bg-opacity-5 hover:text-gray-800 dark:text-gray-300",
                item.isActive && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
              )}
            >
              {item.itemIndex}. {item.textContent}
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">Start adding headlines to your document …</div>
      )}
    </>
  );
});

TableOfContents.displayName = "TableOfContents";
