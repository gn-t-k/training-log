import { SessionProvider } from "next-auth/react";
import { FC } from "react";

import type { AppProps } from "next/app";

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
};
export default App;
