import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};
