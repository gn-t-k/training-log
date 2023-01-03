import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useSessionContext } from "@/features/auth/session-context/session-context";

const OnboardingContainer: NextPage = () => {
  return (
    <RequireLogin>
      <Onboarding />
    </RequireLogin>
  );
};
export default OnboardingContainer;

const Onboarding: FC = () => {
  const { trainee } = useSessionContext();
  const router = useRouter();
  const traineeQuery = trpc.getTrainee.useQuery({ id: trainee.id });
  const registerTraineeMutation = trpc.registerTrainee.useMutation();

  useEffect(() => {
    let ignore = false;

    if (
      traineeQuery.status === "success" &&
      registerTraineeMutation.status === "idle" &&
      ignore === false
    ) {
      registerTraineeMutation.mutate({
        id: trainee.id,
        name: trainee.name,
        image: trainee.image,
      });
    }

    return () => {
      ignore = true;
    };
  }, [
    registerTraineeMutation,
    trainee.id,
    trainee.image,
    trainee.name,
    traineeQuery.status,
  ]);

  if (traineeQuery.isLoading) {
    // TODO
    return <p>トレーニー情報を読込中</p>;
  }

  if (traineeQuery.data !== null) {
    router.push(pagesPath.$url());

    return null;
  }

  switch (registerTraineeMutation.status) {
    case "idle":
    case "loading":
      // TODO
      return <p>トレーニー情報を登録中</p>;
    case "success": {
      router.push(pagesPath.$url());
      // TODO
      return <p>リダイレクト中</p>;
    }
    case "error":
      // TODO
      return <p>エラー</p>;
  }
};
