import { Text } from "@chakra-ui/react";
import { addMinutes } from "date-fns";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Muscle } from "../muscle";
import type { FC } from "react";

type Props = {
  muscle: Muscle;
  start: Date;
};
export const WeeklyNumberOfSetsItem: FC<Props> = (props) => {
  const utcDate = addMinutes(props.start, props.start.getTimezoneOffset());
  const weeklyNumberOfSetsQuery = trpc.muscle.getWeeklyNumberOfSets.useQuery({
    id: props.muscle.id,
    start: utcDate,
  });

  switch (weeklyNumberOfSetsQuery.status) {
    case "loading":
      return <Loading />;
    case "success":
      return (
        <WeeklyNumberOfSetsItemView
          muscleName={props.muscle.name}
          weeklyNumberOfSets={weeklyNumberOfSetsQuery.data}
        />
      );
    case "error":
      // TODO
      return <p>セット数の取得に失敗しました</p>;
  }
};

type ViewProps = {
  muscleName: string;
  weeklyNumberOfSets: number;
};
export const WeeklyNumberOfSetsItemView: FC<ViewProps> = (props) => {
  return (
    <Text>
      {props.muscleName}: {String(props.weeklyNumberOfSets)} セット
    </Text>
  );
};
