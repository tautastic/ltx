import type { NextPageWithAuthAndLayout } from "~/lib/types";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";
import { type editorFormSchemaType, FullscreenEditorWrapper } from "~/components/fullscreen-editor-wrapper";
import type { JSONContent } from "ltx-editor";
import Editor from "~/components/editor/advanced-editor";
import { useState } from "react";

const Create: NextPageWithAuthAndLayout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const newPageMutation = api.pages.createNewPage.useMutation();
  const [value, setValue] = useState<JSONContent | undefined>(undefined);

  const onSubmit: (selectedTagIds: string[]) => SubmitHandler<editorFormSchemaType> =
    (selectedTagIds: string[]) => async (data) => {
      try {
        const res = await newPageMutation.mutateAsync({
          selectedTagIds,
          pageArgs: {
            title: data.title,
            description: data.description,
            isPrivate: data.isPrivate,
            content: value ? JSON.stringify(value) : "",
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
      } catch (_e) {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error creating document.",
        });
      }
    };

  if (!session || !session.user) {
    return null;
  }

  return (
    <FullscreenEditorWrapper authorId={session.user.id} onSubmit={onSubmit}>
      <Editor isHeaderVisible={true} initialValue={value} onChange={setValue} />
    </FullscreenEditorWrapper>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">{page}</main>;
};
export default Create;
