import { type NextPageWithAuthAndLayout } from "~/lib/types";
import { PlusIcon } from "lucide-react";
import AuthDropdown from "~/components/auth-dropdown";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import Header from "~/components/header";
import Footer from "~/components/footer";
import {
  Fieldset,
  FieldsetAction,
  FieldsetContent,
  FieldsetFooter,
} from "~/components/ui/fieldset";
import { BlockEditor } from "~/components/editor/BlockEditor";
import React, { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogAction,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ColorPicker } from "~/components/editor/panels";
import * as Popover from "@radix-ui/react-popover";
import { Label } from "~/components/ui/label";
import { Tag } from "~/components/tag";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

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

const Create: NextPageWithAuthAndLayout = () => {
  const queryClient = useQueryClient();
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const session = useSession().data;
  const deleteTagByIdMutation = api.tags.deleteTagById.useMutation();

  const handleDeleteTag = async (id: string) => {
    await deleteTagByIdMutation.mutateAsync(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ stale: true });
      },
    });
  };

  if (!session || !session.user) {
    return null;
  }

  const { data: tags } = api.tags.getTagListByAuthorId.useQuery(session?.user.id);

  return (
    <div className="flex w-full flex-col gap-y-10 sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch]">
      <Fieldset
        ref={editorContainerRef}
        className="m-auto w-full max-w-screen-sm opacity-0 md:max-w-[75ch] lg:max-w-[95ch]"
      >
        <FieldsetContent className="min-h-[30ch] px-0">
          <BlockEditor containerRef={editorContainerRef} isHeaderVisible={false} />
        </FieldsetContent>
        <Fieldset className="rounded-none border-x-0 border-b-0">
          <FieldsetContent>
            <h4 className="mb-1 text-xl font-[600]">Save Page</h4>
            <p className="mb-2 text-sm text-gray-900 dark:text-gray-200">
              In order to save your page, please tell us more about it.
            </p>
            <div className="flex flex-col gap-y-4">
              <Input placeholder="Title" minLength={1} maxLength={48} required />
              <Textarea placeholder="Description" rows={5} maxLength={300} />
              <ul className="flex select-none flex-wrap items-center gap-4">
                {tags &&
                  tags.map((tag) => (
                    <Tag onDelete={() => handleDeleteTag(tag.id)} key={tag.id} {...tag} />
                  ))}
                <li className="inline-flex h-10 rounded-md border border-gray-200 dark:border-gray-800">
                  <CreateTagDialog />
                </li>
              </ul>
            </div>
          </FieldsetContent>
          <FieldsetFooter>
            <FieldsetAction>
              <Button Size="sm">Save</Button>
            </FieldsetAction>
          </FieldsetFooter>
        </Fieldset>
      </Fieldset>
    </div>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start py-8">{page}</main>
      <Footer />
    </div>
  );
};
export default Create;
