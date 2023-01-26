import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Redirect } from "@/ui/redirect/redirect";

import { RequireLogin } from "@/features/auth/require-login/require-login";

import type { NextPage } from "next";
import type { FC } from "react";

const LoggedInPage: NextPage = () => {
  return (
    <RequireLogin>
      <LoggedIn />
    </RequireLogin>
  );
};
export default LoggedInPage;

const LoggedIn: FC = () => {
  const traineeQuery = trpc.trainee.getBySession.useQuery();

  switch (traineeQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニー情報を取得中</p>;
    case "success":
      return (
        <Redirect
          redirectTo={
            traineeQuery.data === null
              ? pagesPath.onboarding.$url()
              : pagesPath.$url()
          }
        />
      );
    case "error":
      // TODO
      return <p>トレーニー情報の取得に失敗しました</p>;
  }
};
