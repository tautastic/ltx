import { cn } from "~/utils/cn";
import { memo, useCallback } from "react";
import { type Editor } from "@tiptap/react";
import { TableOfContents } from "../TableOfContents";
import useWindowSize from "~/lib/hooks/use-window-size";

export const Sidebar = memo(
  ({ editor, isOpen, onClose }: { editor: Editor; isOpen?: boolean; onClose: () => void }) => {
    const { isLarge } = useWindowSize();

    const handlePotentialClose = useCallback(() => {
      onClose();
    }, [onClose]);

    if (!isLarge) {
      return null;
    }

    const windowClassName = cn(
      "absolute top-0 left-0 bg-white lg:backdrop-blur-xl h-full lg:h-auto lg:relative z-[999] w-0 duration-300 ease-out transition-all",
      "dark:bg-black",
      !isOpen && "border-r-transparent",
      isOpen && "w-80 border-r border-r-gray-200 dark:border-r-gray-800"
    );

    return (
      <div className={windowClassName}>
        <div className="h-full w-full overflow-hidden">
          <div
            className={cn(
              "h-full w-full overflow-clip opacity-0",
              isOpen && "p-6 opacity-100 transition-opacity delay-300 duration-200 ease-in"
            )}
          >
            <TableOfContents onItemClick={handlePotentialClose} editor={editor} />
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "TableOfContentSidepanel";
