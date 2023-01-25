import { useRouter } from "next/router";


import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

import type { NextPage } from "next";
import type { FC } from "react";

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
      return <p>トレーニー情報を取得中</p>;
    case "success":
      router.push(
        traineeQuery.data === null
          ? pagesPath.onboarding.$url()
          : pagesPath.$url()
      );
      return <p>リダイレクト中</p>;
    case "error":
      // TODO
      return <p>トレーニー情報の取得に失敗しました</p>;
  }
};
