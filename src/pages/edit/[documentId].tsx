import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import ssr from "~/utils/ssr";
import { useRouter } from "next/router";
import { useToast } from "~/components/ui/use-toast";
import { useSession } from "next-auth/react";
import api from "~/utils/api";
import { type SubmitHandler } from "react-hook-form";
import { type editorFormSchemaType, FullscreenEditor } from "~/components/fullscreen-editor";
import { BlockEditor } from "~/components/editor/BlockEditor";
import { useBlockEditor } from "~/components/editor/BlockEditor/BlockEditorContext";
import { useMemo } from "react";

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ documentId: string }>
) => {
  if (context.params && context.params.documentId) {
    const { documentId } = context.params;

    try {
      const document = await ssr.pages.getPageById.fetch(documentId);
      if (document) {
        return {
          props: {
            trpcState: ssr.dehydrate(),
            document,
          },
        };
      }
    } catch (e) {
      return { notFound: true };
    }
  }

  return { notFound: true };
};

const DocumentEditPage: NextPageWithAuthAndLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ document }) => {
  const { editor } = useBlockEditor();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const updatePageMutation = api.pages.updatePage.useMutation();

  const onSubmit: (selectedTagIds: string[]) => SubmitHandler<editorFormSchemaType> =
    (selectedTagIds: string[]) => async (data) => {
      try {
        const res = await updatePageMutation.mutateAsync({
          pageId: document.id,
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
            description: "Document updated successfully.",
          });
          await router.push(`/u/${session?.user?.username}`);
        } else {
          toast({
            title: "🚨 Uh oh! Something went wrong.",
            description: "Error updating document.",
          });
        }
      } catch (e) {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error updating document.",
        });
      }
    };

  const memoizedEditor = useMemo(
    () => (
      <BlockEditor
        className="mx-auto w-full lg:w-10/12 lg:max-w-[125ch]"
        defaultValue={JSON.parse(document.content)}
        isHeaderVisible={true}
      />
    ),
    [document.content]
  );

  return (
    <FullscreenEditor
      authorId={document.authorId}
      defaultCheckedTagsId={document.tags.map((tag) => tag.id)}
      defaultValues={{
        description: document.description,
        title: document.title,
        isPrivate: document.isPrivate,
      }}
      onSubmit={onSubmit}
    >
      {memoizedEditor}
    </FullscreenEditor>
  );
};

DocumentEditPage.auth = false;
DocumentEditPage.getLayout = (page) => {
  return (
    <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">
      {page}
    </main>
  );
};

export default DocumentEditPage;
