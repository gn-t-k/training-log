import { ChakraUIProvider } from "@/libs/chakra-ui/provider";
import { NextAuthProvider } from "@/libs/next-auth/provider";
import { RecoilProvider } from "@/libs/recoil/provider";

import type { Layout } from "./_utils/types";

const RootLayout: Layout = ({ children }) => {
  return (
    <html lang="ja">
      <body>
        <RecoilProvider>
          <NextAuthProvider>
            <ChakraUIProvider>{children}</ChakraUIProvider>
          </NextAuthProvider>
        </RecoilProvider>
      </body>
    </html>
  );
};
export default RootLayout;
