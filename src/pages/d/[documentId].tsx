import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import ssr from "~/utils/ssr";
import { BlockEditor } from "~/components/editor/BlockEditor";
import { FullscreenEditor } from "~/components/fullscreen-editor";
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

const DocumentViewPage: NextPageWithAuthAndLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ document }) => {
  const memoizedEditor = useMemo(
    () => (
      <BlockEditor
        className="mx-auto w-full lg:w-10/12 lg:max-w-[125ch]"
        defaultValue={JSON.parse(document.content)}
        isHeaderVisible={true}
        readonly={true}
      />
    ),
    [document.content]
  );

  return <FullscreenEditor readonly={true}>{memoizedEditor}</FullscreenEditor>;
};

DocumentViewPage.auth = false;
DocumentViewPage.getLayout = (page) => {
  return (
    <main className="flex min-h-svh flex-col items-stretch justify-start overflow-hidden">
      {page}
    </main>
  );
};

export default DocumentViewPage;
