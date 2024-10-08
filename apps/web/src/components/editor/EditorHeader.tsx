import { ArrowBigLeftDash, FileDown } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import AuthDropdown from "~/components/auth-dropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { exportAsPdf } from "~/utils/print";

export const EditorHeader = ({ title }: { title?: string }) => {
  const { back: routerBack } = useRouter();
  const [canExport, setCanExport] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanExport(true);
    }

    return () => {
      setCanExport(false);
    };
  }, []);

  const handleExportAsPdf = useCallback(() => {
    if (canExport) {
      exportAsPdf(title);
    }
  }, [canExport, title]);

  return (
    <div className="flex flex-none flex-row items-center justify-between border-b border-gray-200 bg-white p-3 py-2 text-black gap-x-4 dark:border-gray-800 dark:bg-black dark:text-white">
      <div className="flex flex-row items-center justify-between flex-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ArrowBigLeftDash
                aria-label="Go back"
                className="h-6 w-6 opacity-75 hover:cursor-pointer"
                onClick={routerBack}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <FileDown
                aria-label="Export as PDF"
                className="h-6 w-6 opacity-75 hover:cursor-pointer"
                onClick={handleExportAsPdf}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as PDF</p>
            </TooltipContent>
          </Tooltip>
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
