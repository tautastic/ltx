import { Icon } from "~/components/editor/ui/Icon";
import { EditorInfo } from "./EditorInfo";
import { Toolbar } from "~/components/editor/ui/Toolbar";
import useWindowSize from "~/lib/hooks/use-window-size";
import { useRouter } from "next/router";
import { ArrowBigLeftDash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

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
  const router = useRouter();
  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-gray-200 bg-white p-3 py-2 text-black dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center gap-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ArrowBigLeftDash
                aria-label="Go back"
                className="h-6 w-6 opacity-75 hover:cursor-pointer"
                onClick={() => router.back()}
              />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
      </div>
      <EditorInfo characters={characters} words={words} />
    </div>
  );
};
