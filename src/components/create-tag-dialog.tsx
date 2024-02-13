import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import api from "~/utils/api";
import {
  Dialog,
  DialogAction,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Input } from "~/components/ui/input";
import * as Popover from "@radix-ui/react-popover/dist";
import { ColorPicker } from "~/components/editor/panels";
import { Label } from "~/components/ui/label";
import { Tag } from "~/components/tag";
import { Button } from "~/components/ui/button";

const CreateTagDialog = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTagColor, setNewTagColor] = useState("#ffffff");
  const [newTagName, setNewTagName] = useState("");
  const newTagMutation = api.tags.createNewTag.useMutation();
  const handleNewTagSubmit = useCallback(async () => {
    if (newTagName.trim().length < 1) {
      return;
    }

    await newTagMutation.mutateAsync(
      {
        color: newTagColor,
        name: newTagName,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ stale: true });
        },
      }
    );

    setNewTagColor("#ffffff");
    setNewTagName("");
    setDialogOpen(false);
  }, [newTagColor, newTagMutation, newTagName, queryClient]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        type="button"
        title="Create tag"
        className="inline-flex w-full items-center justify-center px-2"
      >
        <PlusIcon
          textRendering={"geometricPrecision"}
          className="text-gray-700 dark:text-gray-400"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Tag</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <Input
            required={true}
            aria-required={true}
            type="text"
            aria-label="Tag Name"
            Size="default"
            placeholder="Name"
            value={newTagName}
            onChange={(e) => setNewTagName(e.currentTarget.value)}
          />
          <Popover.Root>
            <Input
              type="text"
              aria-label="Tag Color"
              Size="default"
              value={newTagColor}
              onChange={(e) => {
                setNewTagColor(e.currentTarget.value);
              }}
              Suffix={
                <Popover.Trigger>
                  <div
                    style={{
                      color: newTagColor,
                      backgroundColor: newTagColor,
                    }}
                    className={"h-5 w-5 rounded bg-gray-100 shadow-sm dark:bg-gray-800"}
                  />
                </Popover.Trigger>
              }
            />
            <Popover.Content className={"z-10"} sideOffset={10}>
              <ColorPicker hideFooter={true} color={newTagColor} onChange={setNewTagColor} />
            </Popover.Content>
          </Popover.Root>
          <Label>Preview</Label>
          <ul className="select-none">
            <Tag
              placeholder="Name"
              color={newTagColor}
              id={"newTagId"}
              name={newTagName}
              readonly={true}
            />
          </ul>
        </div>
        <DialogFooter>
          <DialogAction>
            <Button onClick={handleNewTagSubmit} Size="sm">
              Create
            </Button>
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
