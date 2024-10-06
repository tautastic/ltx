import { ArrowBigLeftDash, FileDown } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

export const EditorHeader = ({ title }: { title?: string }) => {
  const router = useRouter();
  const [canExport, setCanExport] = useState(false);

  useEffect(() => {
    const titleLength = title?.trim()?.length ?? 0;
    if (typeof window !== "undefined" && titleLength > 0) {
      setCanExport(true);
    }

    return () => {
      setCanExport(false);
    };
  }, [title]);

  const handleExportToPdf = useCallback(() => {
    if (canExport) {
      const originalTitle = window.document.title;
      window.document.title = title as string;
      window.print();
      window.document.title = originalTitle;
    }
  }, [title, canExport]);

  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-gray-200 bg-white p-3 py-2 text-black gap-x-4 dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center justify-between flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ArrowBigLeftDash
                aria-label="Go back"
                className="h-6 w-6 opacity-75 hover:cursor-pointer"
                onClick={router.back}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
          {canExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <FileDown
                  aria-label="Export as PDF"
                  className="h-6 w-6 opacity-75 hover:cursor-pointer"
                  onClick={handleExportToPdf}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Export as PDF</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
      <div className="flex items-center">
        <div className="flex flex-row items-center">
          <AuthDropdown />
        </div>
      </div>
    </div>
  );
};
