import { TagIcon, XIcon } from "lucide-react";
import type { ChangeEventHandler } from "react";
import { cn } from "~/utils/cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export type TagProps = {
  color: string;
  defaultChecked?: boolean;
  id: string;
  name: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onDelete?: () => void;
  placeholder?: string;
  readonly?: boolean;
};

const DeleteAlert = ({ onDelete }: { onDelete?: () => void }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" title="Delete tag" className="m-1 h-min">
        <XIcon textRendering={"geometricPrecision"} className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your tag.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel Size="sm">Cancel</AlertDialogCancel>
          <AlertDialogAction Size="sm" onClick={onDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Tag = ({
  color,
  defaultChecked = false,
  id,
  name,
  onChange,
  onDelete,
  placeholder,
  readonly = false,
}: TagProps) => {
  const showPlaceholder = name.trim().length < 1 && placeholder && placeholder.trim().length > 0;

  return (
    <li className="h-10 flex-1 text-sm font-medium">
      <input
        defaultChecked={defaultChecked}
        onChange={onChange}
        type="checkbox"
        id={id}
        value={id}
        className="peer hidden"
      />
      <div
        className={cn(
          "flex justify-between gap-x-6 rounded border border-gray-200 dark:border-gray-800",
          !readonly && "opacity-60 peer-checked:border-blue-600 peer-checked:opacity-100",
        )}
      >
        <label htmlFor={id} className="flex flex-1 cursor-pointer items-center gap-x-1.5 py-2 pl-3">
          <TagIcon textRendering={"geometricPrecision"} className="h-4 w-4" color={color} />
          {showPlaceholder ? (
            <p className="line-clamp-1 break-keep opacity-60 md:line-clamp-2">{placeholder}</p>
          ) : (
            <p className="line-clamp-1 break-keep md:line-clamp-2">{name}</p>
          )}
        </label>
        {!readonly && <DeleteAlert onDelete={onDelete} />}
      </div>
    </li>
  );
};
