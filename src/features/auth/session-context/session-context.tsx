import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

import type { FC, ReactNode } from "react";

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
  Loading: JSX.Element;
  Failure: JSX.Element;
  Unauthenticated: JSX.Element;
};
export const SessionContextProvider: FC<Props> = (props) => {
  const session = useSession();

  switch (session.status) {
    case "loading":
      return props.Loading;
    case "authenticated": {
      const user = session.data?.user;
      if (!user || !user.id || !user.name || !user.image) {
        return props.Failure;
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
          {props.children}
        </SessionContext.Provider>
      );
    }
    case "unauthenticated": {
      return props.Unauthenticated;
    }
  }
};

const SessionContext = createContext<Session | null>(null);
