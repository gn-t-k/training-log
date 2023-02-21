import { Stack } from "@chakra-ui/react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import { WeeklyNumberOfSetsItem } from "../weekly-number-of-sets-item/weekly-number-of-sets-item";

import type { Muscle } from "../muscle";
import type { FC } from "react";

type Props = {
  start: Date;
};
export const WeeklyNumberOfSetsList: FC<Props> = (props) => {
  const musclesQuery = trpc.muscle.getAll.useQuery();

  switch (musclesQuery.status) {
    case "loading":
      return <Loading description="部位データを取得しています" />;
    case "success":
      return (
        <WeeklyNumberOfSetsListView
          start={props.start}
          muscles={musclesQuery.data}
          WeeklyNumberOfSetsItem={WeeklyNumberOfSetsItem}
        />
      );
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  start: Date;
  muscles: Muscle[];
  WeeklyNumberOfSetsItem: typeof WeeklyNumberOfSetsItem;
};
export const WeeklyNumberOfSetsListView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column">
      {props.muscles.map((muscle) => {
        return (
          <props.WeeklyNumberOfSetsItem
            key={muscle.id}
            muscle={muscle}
            start={props.start}
          />
        );
      })}
    </Stack>
  );
};
