import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";

import { trpc } from "@/_libs/trpc/client/trpc";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { FC, ReactElement } from "react";

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App: FC<AppPropsWithLayout> = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout ?? ((page): ReactElement => page);

  return (
    <RecoilRoot>
      <SessionProvider>
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};
export default trpc.withTRPC(App);
