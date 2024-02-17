import { type NextPageWithAuthAndLayout } from "~/lib/types";
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
  const { editor, characterCount } = useBlockEditor();
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
    <div className="flex w-full flex-col gap-y-10 sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch] xl:max-w-[125ch]">
      <Fieldset className="m-auto w-full max-w-screen-sm md:max-w-[75ch] lg:max-w-[95ch] xl:max-w-[125ch]">
        <FieldsetContent className="mx-auto min-h-[25ch] px-0 md:min-h-[30ch] lg:min-h-[40ch]">
          <BlockEditor characterCount={characterCount} editor={editor} isHeaderVisible={true} />
        </FieldsetContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <Fieldset className="rounded-none border-x-0 border-b-0">
              <FieldsetContent>
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
                          <Textarea
                            aria-label="Description"
                            placeholder="Description"
                            rows={5}
                            {...field}
                          />
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
                </div>
              </FieldsetContent>
              <FieldsetFooter>
                <FieldsetAction>
                  <Button type="submit" Size="sm">
                    Save
                  </Button>
                </FieldsetAction>
              </FieldsetFooter>
            </Fieldset>
          </form>
        </Form>
      </Fieldset>
    </div>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <>
      <Header scrollThreshhold={0}>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start py-8">{page}</main>
      <Footer />
    </>
  );
};
export default Create;
