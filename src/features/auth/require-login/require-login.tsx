import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { SessionContextProvider } from "../session-context/session-context";

type Props = {
  children: ReactNode;
};
export const RequireLogin: FC<Props> = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  switch (session.status) {
    case "loading":
      // TODO
      return <p>loading</p>;
    case "authenticated":
      return <SessionContextProvider>{children}</SessionContextProvider>;
    case "unauthenticated": {
      router.push(pagesPath.login.$url());
      return null;
    }
  }
};
