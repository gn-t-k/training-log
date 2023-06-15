import { Text } from "@chakra-ui/react";
import Head from "next/head";
import { useCallback, useEffect } from "react";

import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { useSessionContext } from "@/_features/auth/session-context/session-context";
import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import type { MutationState } from "@/_utils/mutation-state";
import type { NextPage } from "next";
import type { FC } from "react";

const OnboardingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>トレーニー情報を登録 | training-log</title>
      </Head>
      <RequireLogin>
        <Onboarding />
      </RequireLogin>
    </>
  );
};
export default OnboardingPage;

const Onboarding: FC = () => {
  const { authUser } = useSessionContext();
  const traineeQuery = trpc.trainee.getBySession.useQuery();
  const registerTraineeMutation = trpc.trainee.register.useMutation();

  const registerTrainee = useCallback<ViewProps["registerTrainee"]>(() => {
    registerTraineeMutation.mutate({
      name: authUser.name,
      image: authUser.image,
    });
  }, [authUser.image, authUser.name, registerTraineeMutation]);

  switch (traineeQuery.status) {
    case "loading":
      return <Loading description="トレーニー情報を取得しています" />;
    case "success":
      return traineeQuery.data === null ? (
        <OnboardingView
          registerTrainee={registerTrainee}
          registerTraineeStatus={registerTraineeMutation.status}
        />
      ) : (
        <Redirect redirectTo={pagesPath.$url()} />
      );
    case "error":
      // TODO
      return <Text>トレーニー情報の取得に失敗しました</Text>;
  }
};

type ViewProps = {
  registerTrainee: () => void;
  registerTraineeStatus: MutationState;
};
const OnboardingView: FC<ViewProps> = ({
  registerTrainee,
  registerTraineeStatus,
}) => {
  useEffect(() => {
    let ignore = false;

    if (!ignore && registerTraineeStatus === "idle") {
      registerTrainee();
    }

    return () => {
      ignore = true;
    };
  }, [registerTrainee, registerTraineeStatus]);

  switch (registerTraineeStatus) {
    case "idle":
      return <Loading description="処理を待機しています" />;
    case "loading":
      return <Loading description="トレーニー情報を登録しています" />;
    case "success":
      return <Redirect redirectTo={pagesPath.$url()} />;
    case "error":
      // TODO
      return <p>トレーニーの登録に失敗しました</p>;
  }
};
