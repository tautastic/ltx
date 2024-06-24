import Head from "next/head";
import AuthDropdown from "~/components/auth-dropdown";

import { ConwayBackground } from "~/components/conway-background";
import Footer from "~/components/footer";
import Header from "~/components/header";
import type { NextPageWithAuthAndLayout } from "~/lib/types";

const Custom404: NextPageWithAuthAndLayout = () => {
  return (
    <>
      <Head>
        <title>404: Page not found</title>
      </Head>
      <main className="flex min-h-[80vh] items-center justify-center pt-12">
        <div className="flex flex-col items-center justify-center gap-y-8 text-center">
          <div className="h-10">
            <h1 className="mr-3 inline-block border-r-2 border-r-black pr-3 align-middle text-3xl font-semibold dark:border-r-white md:text-4xl">
              404
            </h1>
            <div className="inline-block text-left align-middle">
              <h2 className="text-xl md:text-2xl">Page not found.</h2>
            </div>
          </div>
        </div>
      </main>
      <ConwayBackground />
    </>
  );
};

Custom404.auth = false;
Custom404.getLayout = (page) => {
  return (
    <>
      <Header>
        <AuthDropdown />
      </Header>
      <main className="min-h-screen">{page}</main>
      <Footer />
    </>
  );
};

export default Custom404;
