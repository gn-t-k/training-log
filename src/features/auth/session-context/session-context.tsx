import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, FC, ReactNode, useContext } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Trainee } from "@/features/trainee/trainee";

type Session = {
  authUser: AuthUser;
  trainee: Trainee;
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
  const trainee = trpc.trainee.getBySession.useQuery();

  if (session.status === "loading") {
    // TODO
    return <p>loading</p>;
  }

  if (session.status === "unauthenticated") {
    router.push(pagesPath.login.$url());

    return null;
  }

  const user = session.data?.user;
  if (!user || !user.id || !user.name || !user.image) {
    // TODO
    return <p>error</p>;
  }

  if (!trainee.data) {
    // TODO
    return <p>loading</p>;
  }

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    image: user.image,
  };
  const sessionContext: Session = {
    authUser,
    trainee: trainee.data,
  };

  return (
    <SessionContext.Provider value={sessionContext}>
      {children}
    </SessionContext.Provider>
  );
};

const SessionContext = createContext<Session | null>(null);
