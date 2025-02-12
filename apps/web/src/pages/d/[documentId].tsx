import type { JSONContent } from "ltx-editor";
import { memo, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { EditorHeader } from "~/components/editor/EditorHeader";
import Editor from "~/components/editor/advanced-editor";
import { FullscreenEditorWrapper } from "~/components/fullscreen-editor-wrapper";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import { exportAsPdf } from "~/utils/print";
import api from "~/utils/api";

const EditorHeaderMemo = memo<{
  title: string;
}>(({ title }) => {
  return <EditorHeader title={title} />;
});

const EditorMemo = memo<{
  title: string;
  print: boolean;
  value?: JSONContent;
}>(({ title, print, value }) => {
  const onCreateHandler = useCallback(() => {
    exportAsPdf(title);
  }, [title]);

  const onCreate = print ? onCreateHandler : undefined;

  return (
    <Editor readonly={true} slotBefore={<EditorHeaderMemo title={title} />} initialValue={value} onCreate={onCreate} />
  );
});

const DocumentViewPage: NextPageWithAuthAndLayout = () => {
  const router = useRouter();
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const [onLoadExportAsPdf, setOnLoadExportAsPdf] = useState<boolean>(false);

  useEffect(() => {
    const documentId = router.query.documentId;
    if (typeof documentId === "string") {
      setDocumentId(documentId);
    }

    if (router.query.print === "pdf") {
      setOnLoadExportAsPdf(true);
    }

    return () => {
      setDocumentId(undefined);
      setOnLoadExportAsPdf(false);
    };
  }, [router.query.documentId, router.query.print]);

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

  const value = page.content ? JSON.parse(page.content) : undefined;

  return (
    <FullscreenEditorWrapper readonly={true}>
      <EditorMemo title={page.title} print={onLoadExportAsPdf} value={value} />
    </FullscreenEditorWrapper>
  );
};

DocumentViewPage.auth = false;
DocumentViewPage.getLayout = (page) => {
  return <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">{page}</main>;
};

export default DocumentViewPage;
