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
  return (
    <div className="flex w-full flex-col gap-y-10 sm:max-w-[70ch] md:max-w-[75ch] lg:max-w-[95ch]">
      <Editor placeholder="Start typing here..." />
    </div>
  );
};

Create.auth = true;
Create.getLayout = (page) => {
  return (
    <div>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="flex min-h-screen flex-col items-center justify-start py-8">
        <Provider>{page}</Provider>
      </main>
      <Footer />
    </div>
  );
};
export default Create;
