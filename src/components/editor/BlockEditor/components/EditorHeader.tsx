import { EditorInfo } from "./EditorInfo";
import { type EditorUser } from "../types";

export type EditorHeaderProps = {
  characters: number;
  user?: EditorUser;
  words: number;
};

export const EditorHeader = ({ characters, user, words }: EditorHeaderProps) => {
  return (
    <div className="flex flex-none flex-row items-center justify-end border-b border-gray-200 bg-white py-2 pl-6 pr-3 text-black dark:border-gray-800 dark:bg-black dark:text-white">
      <EditorInfo characters={characters} words={words} user={user} />
    </div>
  );
};
