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
import { XIcon } from "lucide-react";
import React from "react";

export const DeleteAlert = ({
  description,
  onDelete,
}: {
  description: string;
  onDelete?: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger type="button" title="Delete tag" className="m-1 h-min">
        <XIcon textRendering={"geometricPrecision"} className="h-4 w-4" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
