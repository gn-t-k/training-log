import { Stack, Text } from "@chakra-ui/react";

import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import type { Record, Set } from "@/_features/training/training";
import type { FC } from "react";

type Props = {
  exerciseId: string;
};
export const LatestRecordText: FC<Props> = (props) => {
  const getLatestRecordQuery = trpc.exercise.getLatestRecord.useQuery({
    id: props.exerciseId,
  });

  switch (getLatestRecordQuery.status) {
    case "loading":
      return <Loading />;
    case "success":
      return <LatestRecordTextView record={getLatestRecordQuery.data} />;
    case "error":
      return <p>前回の記録の取得に失敗しました</p>;
  }
};

type ViewProps = {
  record: Record | null;
};
export const LatestRecordTextView: FC<ViewProps> = (props) => {
  return props.record === null ? (
    <Text>まだトレーニングが登録されていません</Text>
  ) : (
    <Stack direction="column">
      {props.record.sets.map((set) => (
        <SetComponent key={set.id} set={set} />
      ))}
    </Stack>
  );
};

type SetProps = {
  set: Set;
};
const SetComponent: FC<SetProps> = (props) => {
  return (
    <Text>
      {props.set.weight} kg {props.set.repetition} 回
    </Text>
  );
};
