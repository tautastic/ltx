import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { NextSeo } from "next-seo";
import NextNProgress from "nextjs-progressbar";
import SEO from "next-seo.config";
import Head from "next/head";

import { type NextPageWithAuthAndLayout } from "~/lib/types";
import api from "~/utils/api";
import "~/styles/index.css";

type AppPropsWithAuthAndLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithAuthAndLayout;
};

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithAuthAndLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <NextSeo {...SEO} />
      <NextNProgress
        color={"#F81CE5"}
        options={{
          showSpinner: false,
        }}
      />
      <SessionProvider session={session} refetchOnWindowFocus={false}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {Component.auth ? (
            <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

const Auth = ({ children }: { children: ReactNode }) => {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return null;
  }

  return <>{children}</>;
};

export default api.withTRPC(MyApp);
