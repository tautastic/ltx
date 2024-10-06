import type { JSONContent } from "ltx-editor";
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import { EditorHeader } from "~/components/editor/EditorHeader";
import Editor from "~/components/editor/advanced-editor";
import { FullscreenEditorWrapper } from "~/components/fullscreen-editor-wrapper";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import ssr from "~/utils/ssr";

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

const DocumentViewPage: NextPageWithAuthAndLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  document,
}) => {
  const [value, _setValue] = useState<JSONContent | undefined>(
    document.content ? JSON.parse(document.content) : undefined,
  );

  return (
    <FullscreenEditorWrapper readonly={true}>
      <Editor readonly={true} slotBefore={<EditorHeader title={document.title} />} initialValue={value} />
    </FullscreenEditorWrapper>
  );
};

DocumentViewPage.auth = false;
DocumentViewPage.getLayout = (page) => {
  return <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">{page}</main>;
};

export default DocumentViewPage;
