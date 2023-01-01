import { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

const LoggedIn: NextPage = () => {
  const onClick: MouseEventHandler = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}${
        pagesPath.login.$url().pathname
      }`,
    });
  };
  const session = useSession();

  const id = session.data?.user.id;
  const trainee = trpc.getTraineeById.useQuery({ id });

  return (
    <RequireLogin>
      <p>logged in</p>
      <p>{JSON.stringify(trainee.data)}</p>
      <button {...{ onClick }}>logout</button>
    </RequireLogin>
  );
};
export default LoggedIn;
