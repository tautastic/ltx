import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { type TagList } from "~/schemas";
import { TagIcon } from "lucide-react";
import { DialogTrigger } from "~/components/ui/dialog";
import { type CheckedState } from "@radix-ui/react-checkbox";

export interface TagSelectDropdownProps {
  checked: (id: string) => CheckedState | undefined;
  onCheckedChange: (id: string) => (checked: boolean) => void;
  tags: TagList;
}

export const TagSelectDropdown = ({ checked, onCheckedChange, tags }: TagSelectDropdownProps) => {
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
            checked={checked(tag.id)}
            onCheckedChange={onCheckedChange(tag.id)}
          >
            <label htmlFor={tag.id} className="flex flex-1 cursor-pointer items-center gap-x-1.5">
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
