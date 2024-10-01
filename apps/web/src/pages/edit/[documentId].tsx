import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import ssr from "~/utils/ssr";
import { useRouter } from "next/router";
import { useToast } from "~/components/ui/use-toast";
import { useSession } from "next-auth/react";
import api from "~/utils/api";
import type { SubmitHandler } from "react-hook-form";
import { type editorFormSchemaType, FullscreenEditorWrapper } from "~/components/fullscreen-editor-wrapper";
import Editor from "~/components/editor/advanced-editor";
import type { JSONContent } from "ltx-editor";
import { useState } from "react";

export const getServerSideProps = async (context: GetServerSidePropsContext<{ documentId: string }>) => {
  if (context.params?.documentId) {
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
    } catch (_e) {
      return { notFound: true };
    }
  }

  return { notFound: true };
};

const DocumentEditPage: NextPageWithAuthAndLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  document,
}) => {
  const [value, setValue] = useState<JSONContent | undefined>(
    document.content ? JSON.parse(document.content) : undefined,
  );
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
            content: value ? JSON.stringify(value) : "",
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

  return (
    <FullscreenEditorWrapper
      authorId={document.authorId}
      defaultCheckedTagsId={document.tags.map((tag) => tag.id)}
      defaultValues={{
        description: document.description,
        title: document.title,
        isPrivate: document.isPrivate,
      }}
      onSubmit={onSubmit}
    >
      <Editor isHeaderVisible={true} initialValue={value} onChange={setValue} />
    </FullscreenEditorWrapper>
  );
};

DocumentEditPage.auth = false;
DocumentEditPage.getLayout = (page) => {
  return <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">{page}</main>;
};

export default DocumentEditPage;
