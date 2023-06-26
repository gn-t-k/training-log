import { Text } from "@chakra-ui/react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { FC } from "react";

type Props = {
  exerciseId: string;
};
export const EstimatedMaximumWeightText: FC<Props> = (props) => {
  const estimatedMaximumWeightQuery =
    trpc.exercise.getEstimatedMaximumWeight.useQuery({ id: props.exerciseId });

  switch (estimatedMaximumWeightQuery.status) {
    case "loading":
      return <Loading />;
    case "success":
      return (
        <EstimatedMaximumWeightTextView
          estimatedMaximumWeight={estimatedMaximumWeightQuery.data}
        />
      );
    case "error":
      // TODO
      return <p>推定1RMの取得に失敗しました</p>;
  }
};

type ViewProps = {
  estimatedMaximumWeight: number | null;
};
export const EstimatedMaximumWeightTextView: FC<ViewProps> = (props) => {
  return (
    <Text>
      {props.estimatedMaximumWeight === null
        ? "まだトレーニングが登録されていません"
        : `${String(props.estimatedMaximumWeight)} kg`}
    </Text>
  );
};
