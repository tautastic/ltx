import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthAndLayout<Props = object, InitialProps = Props> = NextPage<Props> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};
