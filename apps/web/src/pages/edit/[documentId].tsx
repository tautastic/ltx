import type { JSONContent } from "ltx-editor";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { EditorHeader } from "~/components/editor/EditorHeader";
import Editor from "~/components/editor/advanced-editor";
import { FullscreenEditorWrapper, type editorFormSchemaType } from "~/components/fullscreen-editor-wrapper";
import { useToast } from "~/components/ui/use-toast";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import api from "~/utils/api";
import type { Page } from "~/schemas/BasicPageSchema";

const DocumentEditPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter();
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const documentId = router.query.documentId;
    if (typeof documentId === "string") {
      setDocumentId(documentId);
    }

    return () => {
      setDocumentId(undefined);
    };
  }, [router.query.documentId]);

  const {
    data: page,
    isLoading,
    isError,
  } = api.pages.getPageById.useQuery(documentId ?? "", {
    enabled: !!documentId,
    retry: false,
  });

  if (isLoading) {
    return null;
  }

  if (isError || !page) {
    router.replace("/404").then((_) => null);
    return null;
  }

  return <DocumentEditPageContent page={page} />;
};

const DocumentEditPageContent = ({ page }: { page: Page }) => {
  const [value, setValue] = useState<JSONContent | undefined>(page.content ? JSON.parse(page.content) : undefined);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const updatePageMutation = api.pages.updatePage.useMutation();

  const onSubmit: (selectedTagIds: string[]) => SubmitHandler<editorFormSchemaType> =
    (selectedTagIds: string[]) => async (data) => {
      try {
        const res = await updatePageMutation.mutateAsync({
          pageId: page.id,
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
      } catch (_e) {
        toast({
          title: "🚨 Uh oh! Something went wrong.",
          description: "Error updating document.",
        });
      }
    };

  return (
    <FullscreenEditorWrapper
      authorId={session?.user?.id}
      defaultCheckedTagsId={page.tags.map((tag) => tag.id)}
      defaultValues={{
        description: page.description,
        title: page.title,
        isPrivate: page.isPrivate,
      }}
      onSubmit={onSubmit}
    >
      <Editor slotBefore={<EditorHeader title={page.title} />} initialValue={value} onChange={setValue} />
    </FullscreenEditorWrapper>
  );
};

DocumentEditPage.auth = true;
DocumentEditPage.getLayout = (page) => {
  return <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">{page}</main>;
};

export default DocumentEditPage;
