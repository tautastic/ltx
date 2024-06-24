import { z } from "zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { memo, type ReactNode, useCallback, useState } from "react";
import { Fieldset, FieldsetContent } from "~/components/ui/fieldset";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import CreateTagDialog from "~/components/create-tag-dialog";
import { DialogTrigger } from "~/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import api from "~/utils/api";
import { Tag } from "~/components/tag";
import { useToast } from "~/components/ui/use-toast";

export const editorFormSchema = z.object({
  description: z.string().max(500, {
    message: "Description must be at most 500 characters.",
  }),
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(64, {
      message: "Title must be at most 64 characters.",
    }),
  isPrivate: z.boolean(),
});

export type editorFormSchemaType = z.infer<typeof editorFormSchema>;

export interface FullscreenEditorProps {
  authorId: string;
  children?: ReactNode;
  defaultCheckedTagsId?: string[];
  defaultValues?: Partial<editorFormSchemaType>;
  onSubmit: (selectedTagIds: string[]) => SubmitHandler<editorFormSchemaType>;
  readonly?: boolean;
}

const EditableFullscreenEditor = memo(
  ({
    authorId,
    defaultCheckedTagsId = [],
    defaultValues = {
      description: "",
      title: "",
      isPrivate: false,
    },
    onSubmit,
  }: Omit<Omit<FullscreenEditorProps, "children">, "readonly">) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const deleteTagByIdMutation = api.tags.deleteTagById.useMutation();
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(defaultCheckedTagsId);

    const isTagSelected = useCallback((tagId: string) => selectedTagIds.includes(tagId), [selectedTagIds]);

    const form = useForm<editorFormSchemaType>({
      resolver: zodResolver(editorFormSchema),
      defaultValues,
    });

    const handleDeleteTag = useCallback(
      async (id: string) => {
        await deleteTagByIdMutation.mutateAsync(id, {
          onSuccess: () => {
            setSelectedTagIds(selectedTagIds.filter((tagId) => tagId !== id));
            queryClient.invalidateQueries({ stale: true });
            toast({
              title: "Deleted tag successfully.",
            });
          },
          onError: () => {
            toast({
              title: "🚨 Uh oh! Something went wrong.",
              description: "Error deleting tag.",
            });
          },
        });
      },
      [deleteTagByIdMutation, queryClient, selectedTagIds, toast],
    );

    const { data: tags } = api.tags.getTagListByAuthorId.useQuery(authorId);

    return (
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit(selectedTagIds))(e);
            form.reset(defaultValues);
            setSelectedTagIds([]);
          }}
        >
          <Fieldset className="basis-[502px] rounded-none border-x-0 border-b-0">
            <FieldsetContent className="mx-auto w-full lg:w-8/12 lg:max-w-[110ch]">
              <h4 className="mb-2 text-xl font-[600]">Save Document</h4>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" aria-label="Title" Size="default" placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea aria-label="Description" placeholder="Description" rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <ul className="flex select-none flex-wrap items-center gap-4">
                    {tags?.map((tag) => (
                      <Tag
                        onChange={() => {
                          if (selectedTagIds.includes(tag.id)) {
                            setSelectedTagIds(selectedTagIds.filter((id) => id !== tag.id));
                          } else {
                            setSelectedTagIds([...selectedTagIds, tag.id]);
                          }
                        }}
                        onDelete={() => handleDeleteTag(tag.id)}
                        defaultChecked={isTagSelected(tag.id)}
                        key={tag.id}
                        {...tag}
                      />
                    ))}
                    <li className="inline-flex h-10 rounded-md border border-gray-200 dark:border-gray-800">
                      <CreateTagDialog>
                        <DialogTrigger
                          type="button"
                          title="Create tag"
                          className="inline-flex w-full items-center justify-center px-2"
                        >
                          <PlusIcon textRendering={"geometricPrecision"} className="text-gray-700 dark:text-gray-400" />
                        </DialogTrigger>
                      </CreateTagDialog>
                    </li>
                  </ul>
                </div>
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-x-2 space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Private</FormLabel>
                        <FormDescription>Controls wether or not this Document can be seen by others.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full self-end sm:max-w-32">
                  Save
                </Button>
              </div>
            </FieldsetContent>
          </Fieldset>
        </form>
      </Form>
    );
  },
);

EditableFullscreenEditor.displayName = "EditableFullscreenEditor";

export const FullscreenEditorWrapper = memo(
  ({ authorId, children, defaultCheckedTagsId, defaultValues, onSubmit, readonly }: Partial<FullscreenEditorProps>) => {
    return (
      <Fieldset className="flex w-full flex-1 flex-col items-stretch border-0">
        <FieldsetContent className="flex min-h-[30ch] w-full flex-1 items-stretch bg-gray-50 p-0 dark:bg-gray-950 sm:min-h-[40ch]">
          {children}
        </FieldsetContent>
        {authorId && onSubmit && !readonly && (
          <EditableFullscreenEditor
            authorId={authorId}
            defaultCheckedTagsId={defaultCheckedTagsId}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          />
        )}
      </Fieldset>
    );
  },
);

FullscreenEditorWrapper.displayName = "FullscreenEditor";
