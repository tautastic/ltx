"use client";

import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { type Tag } from "~/schemas";
import React, { type Dispatch, type SetStateAction } from "react";
import { TagIcon } from "lucide-react";
import { DialogTrigger } from "~/components/ui/dialog";

export interface TagSelectDropdownProps {
  tags: SelectableTagList;
}

interface SelectableTag extends Tag {
  selected: boolean;
  setSelected: Dispatch<SetStateAction<boolean>>;
}

type SelectableTagList = SelectableTag[];

export const TagSelectDropdown = ({ tags }: TagSelectDropdownProps) => {
  return (
    <>
      <DropdownMenuLabel className="bg-gray-50 text-center dark:bg-gray-900">
        Tags
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <DropdownMenuCheckboxItem
            key={tag.id}
            checked={tag.selected}
            onCheckedChange={tag.setSelected}
          >
            <label
              htmlFor={tag.id}
              className="flex flex-1 cursor-pointer items-center gap-x-1.5 py-2 pl-3"
            >
              <TagIcon textRendering={"geometricPrecision"} className="h-4 w-4" color={tag.color} />
              <p className="break-keep">{tag.name}</p>
            </label>
          </DropdownMenuCheckboxItem>
        ))
      ) : (
        <DropdownMenuItem className="text-center" disabled>
          This user has no tags
        </DropdownMenuItem>
      )}
      <DropdownMenuSeparator />
      <DropdownMenuItem className="p-0">
        <DialogTrigger type="button" title="Create tag" className="w-full py-3">
          Create new tag
        </DialogTrigger>
      </DropdownMenuItem>
    </>
  );
};
