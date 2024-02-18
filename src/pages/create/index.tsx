import { type NextPageWithAuthAndLayout } from "~/lib/types";
import api from "~/utils/api";
import { useSession } from "next-auth/react";
import { type SubmitHandler } from "react-hook-form";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/router";
import { type editorFormSchemaType, FullscreenEditor } from "~/components/fullscreen-editor";
import { BlockEditor } from "~/components/editor/BlockEditor";
import { useBlockEditor } from "~/components/editor/BlockEditor/BlockEditorContext";

const Create: NextPageWithAuthAndLayout = () => {
  const router = useRouter();
  const { editor } = useBlockEditor();
  const { toast } = useToast();
  const { data: session } = useSession();
  const newPageMutation = api.pages.createNewPage.useMutation();

  const onSubmit: (selectedTagIds: string[]) => SubmitHandler<editorFormSchemaType> =
    (selectedTagIds: string[]) => async (data) => {
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
      }
    };

  if (!session || !session.user) {
    return null;
  }

  return (
    <FullscreenEditor authorId={session.user.id} onSubmit={onSubmit}>
      <BlockEditor className="mx-auto w-full lg:w-10/12 lg:max-w-[125ch]" isHeaderVisible={true} />
    </FullscreenEditor>
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
