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
import React, { useRef, useState } from "react";
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
import { Checkbox } from "~/components/ui/checkbox";
import toast from "react-hot-toast";

const formSchema = z.object({
  description: z.string().max(300, {
    message: "Description must be at most 300 characters.",
  }),
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(48, {
      message: "Title must be at most 48 characters.",
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
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const session = useSession().data;
  const deleteTagByIdMutation = api.tags.deleteTagById.useMutation();
  const newPageMutation = api.pages.createNewPage.useMutation();
  const { editor } = useBlockEditor();
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
          content: JSON.stringify(editor?.getJSON()),
        },
      });

      if (res.id) {
        toast.success("Document created successfully!");
      } else {
        toast.error("Error creating document!");
      }
    } catch (e) {
      toast.error("Error creating document!");
    } finally {
      form.reset(defaultValues);
      setSelectedTagIds([]);
    }
  };

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Fieldset className="rounded-none border-x-0 border-b-0">
              <FieldsetContent>
                <h4 className="mb-1 text-xl font-[600]">Save Document</h4>
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
                      <CreateTagDialog />
                    </li>
                  </ul>
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Private</FormLabel>
                          <FormDescription>
                            Controls wether or not this Document can be seen by others.
                          </FormDescription>
                        </div>
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
