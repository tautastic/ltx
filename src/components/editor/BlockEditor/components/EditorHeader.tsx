import { Icon } from "~/components/editor/ui/Icon";
import { EditorInfo } from "./EditorInfo";
import { Toolbar } from "~/components/editor/ui/Toolbar";
import useWindowSize from "~/lib/hooks/use-window-size";
import Link from "next/link";
import { Ltx } from "~/components/ui/brand-icons";

export type EditorHeaderProps = {
  characters: number;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  words: number;
};

export const EditorHeader = ({
  characters,
  words,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  const { isLarge } = useWindowSize();
  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-gray-200 bg-white p-3 py-2 text-black dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center gap-x-2">
        {isLarge && (
          <div className="flex items-center gap-x-1.5">
            <Toolbar.Button
              tooltip={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              onClick={toggleSidebar}
              active={isSidebarOpen}
              className={isSidebarOpen ? "bg-transparent" : ""}
            >
              <Icon name={isSidebarOpen ? "PanelLeftClose" : "PanelLeft"} />
            </Toolbar.Button>
          </div>
        )}
        <Link aria-label="Go to LTX homepage" title="Go to LTX homepage" href="/">
          <Ltx className="h-[16px] w-auto" width={56} />
        </Link>
      </div>
      <EditorInfo characters={characters} words={words} />
    </div>
  );
};
