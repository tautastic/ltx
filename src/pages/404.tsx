import Head from "next/head";

import { ConwayBackground } from "~/components/conway-background";
import { type NextPageWithAuthAndLayout } from "~/lib/types";

const Custom404: NextPageWithAuthAndLayout = () => {
  return (
    <>
      <Head>
        <title>404: Page not found</title>
      </Head>
      <main className="flex min-h-[80vh] items-center justify-center pt-[20vh]">
        <div className="flex flex-col items-center justify-center gap-y-8 text-center">
          <div className="h-10">
            <h1 className="border-r-dark mr-3 inline-block border-r-2 pr-3 align-middle text-3xl font-semibold dark:border-r-white md:text-4xl">
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
Custom404.getLayout = (page) => page;

export default Custom404;
