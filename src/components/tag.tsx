import { TagIcon, XIcon } from "lucide-react";
import React from "react";
import twcx from "~/utils/twcx";

export type TagProps = {
  color: string;
  id: string;
  name: string;
  onDelete?: () => void;
  placeholder?: string;
  readonly?: boolean;
};

export const Tag = ({ color, id, name, onDelete, placeholder, readonly = false }: TagProps) => {
  const showPlaceholder = name.trim().length < 1 && placeholder && placeholder.trim().length > 0;

  return (
    <li className="h-10 flex-1 text-sm font-medium">
      <input type="checkbox" id={id} value={id} className="peer hidden" />
      <div
        className={twcx(
          "flex justify-between gap-x-6 rounded border border-gray-200 dark:border-gray-800",
          !readonly && "opacity-60 peer-checked:border-blue-600 peer-checked:opacity-100"
        )}
      >
        <label htmlFor={id} className="flex flex-1 cursor-pointer items-center gap-x-1.5 py-2 pl-3">
          <TagIcon textRendering={"geometricPrecision"} className="h-4 w-4" color={color} />
          {showPlaceholder ? (
            <p className="break-keep opacity-60">{placeholder}</p>
          ) : (
            <p className="break-keep">{name}</p>
          )}
        </label>
        {!readonly && (
          <button type="button" title="Delete tag" className="m-1 h-min">
            <XIcon onClick={onDelete} textRendering={"geometricPrecision"} className="h-4 w-4" />
          </button>
        )}
      </div>
    </li>
  );
};
