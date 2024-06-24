import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import type { TagList } from "~/schemas/TagSchema";
import { TagIcon } from "lucide-react";

type CheckedState = boolean | "indeterminate";

export interface TagSelectDropdownProps {
  checked: (id: string) => CheckedState | undefined;
  onCheckedChange: (id: string) => (checked: boolean) => void;
  tags: TagList;
}

export const TagSelectDropdown = ({ checked, onCheckedChange, tags }: TagSelectDropdownProps) => {
  return (
    <>
      <DropdownMenuLabel className="bg-gray-50 text-center dark:bg-gray-900">Tags</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {tags && tags.length > 0 ? (
        tags.map((tag) => (
          <DropdownMenuCheckboxItem key={tag.id} checked={checked(tag.id)} onCheckedChange={onCheckedChange(tag.id)}>
            <label htmlFor={tag.id} className="flex flex-1 cursor-pointer items-center gap-x-1.5 pr-4">
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
    </>
  );
};
