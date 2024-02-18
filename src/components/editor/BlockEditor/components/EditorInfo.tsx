import { memo } from "react";
import AuthDropdown from "~/components/auth-dropdown";

export type EditorInfoProps = {
  characters: number;
  words: number;
};

export const EditorInfo = memo(({ characters, words }: EditorInfoProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-4 flex flex-col justify-center border-r border-gray-200 pr-4 text-right dark:border-gray-800">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {words} {words === 1 ? "word" : "words"}
        </div>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {characters} {characters === 1 ? "character" : "characters"}
        </div>
      </div>
      <div className="flex flex-row items-center">
        <AuthDropdown />
      </div>
    </div>
  );
});

EditorInfo.displayName = "EditorInfo";
