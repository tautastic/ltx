import { type NextPageWithAuthAndLayout } from "~/lib/types";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Fieldset, FieldsetContent } from "~/components/ui/fieldset";
import { BlockEditor } from "~/components/editor/BlockEditor";
import React, { useState } from "react";
import { Tag } from "~/components/tag";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import CreateTagDialog from "~/components/create-tag-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBlockEditor } from "~/lib/hooks/useBlockEditor";
import { useToast } from "~/components/ui/use-toast";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/router";
import { Switch } from "~/components/ui/switch";
import { PlusIcon } from "lucide-react";
import { DialogTrigger } from "~/components/ui/dialog";

const formSchema = z.object({
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

const defaultValues = {
  description: "",
  title: "",
  isPrivate: false,
};

type formSchemaType = z.infer<typeof formSchema>;

const Create: NextPageWithAuthAndLayout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { editor } = useBlockEditor();
  const { toast } = useToast();
  const { data: session } = useSession();
  const deleteTagByIdMutation = api.tags.deleteTagById.useMutation();
  const newPageMutation = api.pages.createNewPage.useMutation();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<formSchemaType> = async (data) => {
    try {
      const res = await newPageMutation.mutateAsync({
        selectedTagIds,
        pageArgs: {
          title: data.title,
          description: data.description,
          isPrivate: data.isPrivate,
          content: JSON.stringify(editor?.$doc.content.toJSON()),
        },
      });

      if (res.id) {
        toast({
          title: "🎉 Wuhuu",
          description: "Document created successfully.",
        });
        await router.push(`/u/${session?.user?.username}`);
      } else {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error creating document.",
        });
      }
    } catch (e) {
      toast({
        title: "🚨 Uh oh! Something went wrong.",
        description: "Error creating document.",
      });
    } finally {
      form.reset(defaultValues);
      setSelectedTagIds([]);
    }
  };

  const handleDeleteTag = async (id: string) => {
    await deleteTagByIdMutation.mutateAsync(id, {
      onSuccess: () => {
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
  };

  if (!session || !session.user) {
    return null;
  }

  const { data: tags } = api.tags.getTagListByAuthorId.useQuery(session?.user.id);

  return (
    <Fieldset className="flex w-full flex-1 flex-col items-stretch border-0">
      <FieldsetContent className="flex min-h-[30ch] w-full items-stretch bg-gray-50 p-0 dark:bg-gray-950 sm:min-h-[40ch]">
        <BlockEditor
          className="mx-auto w-full lg:w-10/12 lg:max-w-[125ch]"
          isHeaderVisible={true}
        />
      </FieldsetContent>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
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
                        <Input
                          type="text"
                          aria-label="Title"
                          Size="default"
                          placeholder="Title"
                          {...field}
                        />
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
                        <Textarea aria-label="Description" placeholder="Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <ul className="flex select-none flex-wrap items-center gap-4">
                    {tags &&
                      tags.map((tag) => (
                        <Tag
                          onClick={() => {
                            setSelectedTagIds([...selectedTagIds, tag.id]);
                          }}
                          onDelete={() => handleDeleteTag(tag.id)}
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
                          <PlusIcon
                            textRendering={"geometricPrecision"}
                            className="text-gray-700 dark:text-gray-400"
                          />
                        </DialogTrigger>
                      </CreateTagDialog>
                    </li>
                  </ul>
                </div>
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start justify-between space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">Private</FormLabel>
                        <FormDescription>
                          Controls wether or not this Document can be seen by others.
                        </FormDescription>
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
    </Fieldset>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">
      {page}
    </main>
  );
};
export default Create;
