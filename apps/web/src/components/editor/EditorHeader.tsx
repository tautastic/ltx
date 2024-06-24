import { useRouter } from "next/router";
import { ArrowBigLeftDash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import AuthDropdown from "~/components/auth-dropdown";

export const EditorHeader = () => {
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
      </div>
      <div className="flex items-center">
        <div className="flex flex-row items-center">
          <AuthDropdown />
        </div>
      </div>
    </div>
  );
};
