import { MilkdownProvider } from "@milkdown/react";
import { type NextPageWithAuthAndLayout } from "~/lib/types";
import Header from "~/components/header";
import AuthDropdown from "~/components/auth-dropdown";
import Footer from "~/components/footer";
import dynamic from "next/dynamic";
import compose from "~/utils/compose";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";

const LTXEditor = dynamic(
  () =>
    import("~/components/editor").then((mod) => ({
      default: mod.LTXEditor,
    })),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

const Provider = compose(MilkdownProvider, ProsemirrorAdapterProvider);

const Create: NextPageWithAuthAndLayout = () => {
  return (
    <Provider>
      <LTXEditor />
    </Provider>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="min-h-screen">{page}</main>
      <Footer />
    </div>
  );
};
export default Create;
