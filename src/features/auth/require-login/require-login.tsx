import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, ReactNode } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

type Props = {
  children: ReactNode;
};
export const RequireLogin: FC<Props> = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    // TODO
    return <p>loading</p>;
  }

  if (session.status === "unauthenticated") {
    router.push(pagesPath.login.$url());

    return null;
  }

  return <>{children}</>;
};
