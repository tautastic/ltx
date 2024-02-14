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
import * as Popover from "@radix-ui/react-popover";
import { ColorPicker } from "~/components/editor/panels";
import { Label } from "~/components/ui/label";
import { Tag } from "~/components/tag";
import { Button } from "~/components/ui/button";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { TRPCClientError } from "@trpc/client";
import { useToast } from "~/components/ui/use-toast";

const formSchema = z.object({
  color: z.string().regex(/^#(?:[0-9a-f]{3}){1,2}$/i, {
    message: "Color must be a valid Hex value.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

const defaultValues = {
  color: "#2285FA",
  name: "",
};

type formSchemaType = z.infer<typeof formSchema>;

const CreateTagDialog = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const newTagMutation = api.tags.createNewTag.useMutation();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onDialogOpen = useCallback(() => {
    form.reset(form.formState.defaultValues);
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, form]);

  const onSubmit: SubmitHandler<formSchemaType> = async (data) => {
    try {
      const res = await newTagMutation.mutateAsync(
        {
          color: data.color,
          name: data.name,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ stale: true });
          },
        }
      );

      if (res.id) {
        toast({
          title: "Wuhuu 🎉",
          description: "Tag created successfully.",
        });
      } else {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error creating tag.",
        });
      }
    } catch (e) {
      if (e instanceof TRPCClientError) {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: e?.message,
        });
      } else {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error creating tag.",
        });
      }
    } finally {
      onDialogOpen();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={onDialogOpen}>
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
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      aria-label="Name"
                      Size="default"
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Popover.Root>
                        <Input
                          type="text"
                          aria-label="Color"
                          Size="default"
                          {...field}
                          Suffix={
                            <Popover.Trigger>
                              <div
                                style={{
                                  color: field.value,
                                  backgroundColor: field.value,
                                }}
                                className={"h-5 w-5 rounded bg-gray-100 shadow-sm dark:bg-gray-800"}
                              />
                            </Popover.Trigger>
                          }
                        />
                        <Popover.Content className={"z-10"} sideOffset={10}>
                          <ColorPicker
                            hideFooter={true}
                            color={field.value}
                            onChange={field.onChange}
                          />
                        </Popover.Content>
                      </Popover.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Label>Preview</Label>
                  <ul className="select-none">
                    <Tag
                      placeholder="Name"
                      color={field.value}
                      id={"newTagId"}
                      name={form.getValues("name")}
                      readonly={true}
                    />
                  </ul>
                </>
              )}
            />
            <DialogFooter>
              <DialogAction>
                <Button type="submit" Size="sm">
                  Create
                </Button>
              </DialogAction>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTagDialog;
