import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import type { NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import ssr from "~/utils/ssr";
import { Fieldset, FieldsetContent } from "~/components/ui/fieldset";
import { BlockEditor } from "~/components/editor/BlockEditor";

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
  return (
    <Fieldset className="m-auto w-full max-w-screen-sm sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch] xl:max-w-[125ch]">
      <FieldsetContent className="min-h-[800px] px-0">
        <BlockEditor
          defaultValue={JSON.parse(document.content)}
          isHeaderVisible={false}
          readonly={true}
        />
      </FieldsetContent>
    </Fieldset>
  );
};

DocumentViewPage.auth = false;
DocumentViewPage.getLayout = (page) => {
  return (
    <>
      <Header scrollThreshhold={0}>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start gap-y-16 px-2 py-20 invert-0 md:gap-y-14 md:py-32">
        {page}
      </main>
      <Footer />
    </>
  );
};

export default DocumentViewPage;
