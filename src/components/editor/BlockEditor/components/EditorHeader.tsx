import { Icon } from "~/components/editor/ui/Icon";
import { EditorInfo } from "./EditorInfo";
import { type EditorUser } from "../types";
import { Toolbar } from "~/components/editor/ui/Toolbar";

export type EditorHeaderProps = {
  characters: number;
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  user?: EditorUser;
  words: number;
};

export const EditorHeader = ({
  characters,
  user,
  words,
  isSidebarOpen,
  toggleSidebar,
}: EditorHeaderProps) => {
  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-gray-200 bg-white py-2 pl-6 pr-3 text-black dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center gap-x-1.5">
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
      </div>
      <EditorInfo characters={characters} words={words} user={user} />
    </div>
  );
};
