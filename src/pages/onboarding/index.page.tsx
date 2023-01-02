import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, useState } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Trainee, traineeSchema } from "@/features/trainee/trainee";

const OnboardingContainer: NextPage = () => {
  const router = useRouter();

  const { id, name, image } = router.query;
  const maybeTrainee = traineeSchema.safeParse({ id, name, image });
  if (!maybeTrainee.success) {
    router.push(pagesPath.$url());

    return null;
  }
  const trainee = maybeTrainee.data;

  return (
    <RequireLogin>
      <Onboarding {...{ trainee }} />
    </RequireLogin>
  );
};
export default OnboardingContainer;

type Props = {
  trainee: Trainee;
};
const Onboarding: FC<Props> = ({ trainee }) => {
  const router = useRouter();
  const traineeQuery = trpc.getTrainee.useQuery({ id: trainee.id });
  const registerTraineeMutation = trpc.registerTrainee.useMutation();

  // トレイニーの登録が複数回実行されないようにするための変数
  const [guard, setGuard] = useState(false);

  if (traineeQuery.isLoading) {
    // TODO
    return <p>トレーニー情報を読込中</p>;
  }

  if (traineeQuery.data !== null) {
    router.push(pagesPath.$url());

    return null;
  }

  switch (registerTraineeMutation.status) {
    case "idle": {
      if (!guard) {
        registerTraineeMutation.mutate({
          id: trainee.id,
          name: trainee.name,
          image: trainee.image,
        });
        setGuard(true);
      }
      // TODO
      return <p>トレーニー情報を登録中</p>;
    }
    case "loading":
      // TODO
      return <p>トレーニー情報を登録中</p>;
    case "success": {
      router.push(pagesPath.logged_in.$url());
      // TODO
      return <p>リダイレクト中</p>;
    }
    case "error":
      // TODO
      return <p>エラー</p>;
  }
};
