import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useSessionContext } from "@/features/auth/session-context/session-context";

const LoggedInContainer: NextPage = () => {
  return (
    <RequireLogin>
      <LoggedIn />
    </RequireLogin>
  );
};
export default LoggedInContainer;

const LoggedIn: FC = () => {
  const router = useRouter();
  const onClick: MouseEventHandler = (e) => {
    e.preventDefault();
    signOut({
      callbackUrl: `${window.location.origin}${
        pagesPath.login.$url().pathname
      }`,
    });
  };
  const {
    trainee: { id, name, image },
  } = useSessionContext();
  const traineeQuery = trpc.getTrainee.useQuery({ id });

  if (traineeQuery.isLoading) {
    // TODO
    return <p>loading</p>;
  }

  if (traineeQuery.data === null) {
    router.push({
      pathname: pagesPath.onboarding.$url().pathname,
      query: { id, name, image },
    });

    return null;
  }

  return (
    <>
      <p>logged in</p>
      <p>{JSON.stringify(traineeQuery.data)}</p>
      <button {...{ onClick }}>logout</button>
    </>
  );
};
