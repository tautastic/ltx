import { type NextPageWithAuthAndLayout } from "~/lib/types";
import { useState } from "react";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBlockEditor } from "~/lib/hooks/useBlockEditor";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";
import {
  editorFormSchema,
  type editorFormSchemaType,
  FullscreenEditor,
} from "~/components/fullscreen-editor";

const Create: NextPageWithAuthAndLayout = () => {
  const router = useRouter();
  const { editor } = useBlockEditor();
  const { toast } = useToast();
  const { data: session } = useSession();
  const newPageMutation = api.pages.createNewPage.useMutation();
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const defaultValues = {
    description: "",
    title: "",
    isPrivate: false,
  };

  const form = useForm<editorFormSchemaType>({
    resolver: zodResolver(editorFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<editorFormSchemaType> = async (data) => {
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

  if (!session || !session.user) {
    return null;
  }

  const { data: tags } = api.tags.getTagListByAuthorId.useQuery(session.user.id);

  return (
    <FullscreenEditor
      form={form}
      onSubmit={onSubmit}
      selectedTagIds={selectedTagIds}
      setSelectedTagIds={setSelectedTagIds}
      tags={tags}
    />
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
