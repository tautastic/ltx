import { memo } from "react";
import { type EditorUser } from "../types";
import Tooltip from "../../ui/Tooltip";

export type EditorInfoProps = {
  characters: number;
  words: number;
  user?: EditorUser;
};

export const EditorInfo = memo(({ characters, user, words }: EditorInfoProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-4 flex flex-col justify-center border-r border-neutral-200 pr-4 text-right dark:border-neutral-800">
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {words} {words === 1 ? "word" : "words"}
        </div>
        <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {characters} {characters === 1 ? "character" : "characters"}
        </div>
      </div>
      <div className="flex flex-row items-center">
        <div className="relative ml-3 flex flex-row items-center">
          {user && (
            <div key={user.clientId} className="-ml-3">
              <Tooltip title={user.name}>
                <img
                  className="h-8 w-8 rounded-full border border-white dark:border-black"
                  src={`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${
                    user.name
                  }&backgroundColor=${user.color.replace("#", "")}`}
                  alt="avatar"
                />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EditorInfo.displayName = "EditorInfo";
