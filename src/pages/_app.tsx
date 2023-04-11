import { type AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { NextSeo } from "next-seo";
import NextNProgress from "nextjs-progressbar";
import SEO from "next-seo.config";
import Head from "next/head";

import { type NextPageWithAuthAndLayout } from "~/lib/types";
import { api } from "~/utils/api";
import "~/styles/globals.css";

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
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") {
      // Do nothing while loading
      return;
    }
    if (!isUser) {
      // If not authenticated, force log in
      void signIn();
    }
  }, [isUser, status]);

  if (isUser) {
    return <>{children}</>;
  }

  return null;
};

export default api.withTRPC(MyApp);
