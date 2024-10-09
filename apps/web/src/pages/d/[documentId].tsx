import type { JSONContent } from "ltx-editor";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { memo, useCallback, useState } from "react";
import { EditorHeader } from "~/components/editor/EditorHeader";
import Editor from "~/components/editor/advanced-editor";
import { FullscreenEditorWrapper } from "~/components/fullscreen-editor-wrapper";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import { exportAsPdf } from "~/utils/print";
import ssr from "~/utils/ssr";

export const getServerSideProps = async (context: GetServerSidePropsContext<{ documentId: string }>) => {
  if (context.params?.documentId) {
    const { documentId } = context.params;

    try {
      const page = await ssr.pages.getPageById.fetch(documentId);
      if (page) {
        const onLoadExportAsPdf = context.query.print === "pdf";
        return {
          props: {
            trpcState: ssr.dehydrate(),
            page,
            onLoadExportAsPdf,
          },
        };
      }
    } catch (_e) {
      return { notFound: true };
    }
  }

  return { notFound: true };
};

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

const DocumentViewPage: NextPageWithAuthAndLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  page,
  onLoadExportAsPdf,
}) => {
  const [value, _setValue] = useState<JSONContent | undefined>(page.content ? JSON.parse(page.content) : undefined);

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
