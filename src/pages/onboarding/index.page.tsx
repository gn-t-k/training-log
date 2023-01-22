import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { useSessionContext } from "@/features/auth/session-context/session-context";

const OnboardingPage: NextPage = () => {
  const router = useRouter();
  const goToTopPage = useCallback<Props["goToTopPage"]>(() => {
    router.push(pagesPath.$url());
  }, [router]);

  return (
    <RequireLogin>
      <Onboarding goToTopPage={goToTopPage} />
    </RequireLogin>
  );
};
export default OnboardingPage;

type Props = {
  goToTopPage: () => void;
};
const Onboarding: FC<Props> = (props) => {
  const { authUser } = useSessionContext();
  const router = useRouter();
  const traineeQuery = trpc.trainee.getBySession.useQuery();
  const registerTraineeMutation = trpc.trainee.register.useMutation();

  const registerTrainee = useCallback<ViewProps["registerTrainee"]>(() => {
    registerTraineeMutation.mutate({
      name: authUser.name,
      image: authUser.image,
    });
  }, [authUser.image, authUser.name, registerTraineeMutation]);

  if (traineeQuery.isLoading) {
    // TODO
    return <p>トレーニー情報を取得中</p>;
  }

  if (traineeQuery.data) {
    router.push(pagesPath.$url());

    // TODO
    return <p>トップページにリダイレクト中</p>;
  }

  return (
    <OnboardingView
      registerTrainee={registerTrainee}
      registerTraineeStatus={registerTraineeMutation.status}
      goToTopPage={props.goToTopPage}
    />
  );
};

type ViewProps = {
  registerTrainee: () => void;
  registerTraineeStatus: MutationState;
  goToTopPage: () => void;
};
const OnboardingView: FC<ViewProps> = ({
  registerTrainee,
  registerTraineeStatus,
  goToTopPage,
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
      // TODO
      return <p>待機中</p>;
    case "loading":
      // TODO
      return <p>トレーニー情報を登録中</p>;
    case "success": {
      goToTopPage();
      // TODO
      return <p>トップページにリダイレクト中</p>;
    }
    case "error":
      // TODO
      return <p>トレーニーの登録に失敗しました</p>;
  }
};
