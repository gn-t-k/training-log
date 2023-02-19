import { Text } from "@chakra-ui/react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Set } from "@/features/training/training";
import type { FC } from "react";

type Props = {
  exerciseId: string;
};
export const LatestSetText: FC<Props> = (props) => {
  const getLatestSetQuery = trpc.exercise.getLatestSet.useQuery({
    id: props.exerciseId,
  });

  switch (getLatestSetQuery.status) {
    case "loading":
      return <Loading />;
    case "success":
      return <LatestSetTextView set={getLatestSetQuery.data} />;
    case "error":
      return <p>前回の記録の取得に失敗しました</p>;
  }
};

type ViewProps = {
  set: Set | null;
};
export const LatestSetTextView: FC<ViewProps> = (props) => {
  return (
    <Text>
      {props.set === null
        ? "まだトレーニングが登録されていません"
        : `${props.set.weight} kg ${props.set.repetition}回`}
    </Text>
  );
};
