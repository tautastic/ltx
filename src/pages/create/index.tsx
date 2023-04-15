import { type NextPageWithAuthAndLayout } from "~/lib/types";
import AuthDropdown from "~/components/auth-dropdown";
import Header from "~/components/header";
import Footer from "~/components/footer";
import dynamic from "next/dynamic";

const Provider = dynamic(() => import("~/components/editor/provider"), {
  ssr: false,
});

const Editor = dynamic(() => import("~/components/editor"), {
  ssr: false,
});

const Create: NextPageWithAuthAndLayout = () => {
  return <Editor />;
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="min-h-screen">
        <Provider>{page}</Provider>
      </main>
      <Footer />
    </div>
  );
};
export default Create;
