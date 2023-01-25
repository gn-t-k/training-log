import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, useContext } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import type { FC, ReactNode} from "react";

type Session = {
  authUser: AuthUser;
};
type AuthUser = {
  id: string;
  name: string;
  image: string;
};

export const useSessionContext = (): Session => {
  const session = useContext(SessionContext);

  if (session === null) {
    throw new Error(
      "`SessionContextProvider`の外側で`SessionContext`が使用されています"
    );
  }

  return session;
};

type Props = {
  children: ReactNode;
};
export const SessionContextProvider: FC<Props> = ({ children }) => {
  const session = useSession();
  const router = useRouter();

  switch (session.status) {
    case "loading":
      // TODO
      return <p>セッション情報を取得中</p>;
    case "authenticated": {
      const user = session.data?.user;
      if (!user || !user.id || !user.name || !user.image) {
        // TODO
        return <p>セッション情報の取得に失敗しました</p>;
      }

      const sessionContext: Session = {
        authUser: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      };

      return (
        <SessionContext.Provider value={sessionContext}>
          {children}
        </SessionContext.Provider>
      );
    }
    case "unauthenticated": {
      router.push(pagesPath.login.$url());

      // TODO
      return <p>ログインページにリダイレクト中</p>;
    }
  }
};

const SessionContext = createContext<Session | null>(null);
