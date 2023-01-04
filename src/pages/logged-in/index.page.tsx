import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

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
  const traineeQuery = trpc.trainee.getBySession.useQuery();

  switch (traineeQuery.status) {
    case "loading":
      // TODO
      return <p>loading</p>;
    case "success":
      router.push(
        traineeQuery.data === null
          ? pagesPath.onboarding.$url()
          : pagesPath.$url()
      );
      return null;
    case "error":
      // TODO
      return <p>error</p>;
  }
};
