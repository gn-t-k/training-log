import { SessionProvider } from "next-auth/react";
import { FC } from "react";
import { RecoilRoot } from "recoil";

import { trpc } from "@/libs/trpc/client/trpc";

import type { AppProps } from "next/app";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </RecoilRoot>
  );
};
export default trpc.withTRPC(App);
