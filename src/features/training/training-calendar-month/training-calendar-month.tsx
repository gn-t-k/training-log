import { Box, Divider, Stack } from "@chakra-ui/react";
import { addDays, getDay, startOfMonth, subDays } from "date-fns";

import { trpc } from "@/libs/trpc/client/trpc";

import type { Month, Year } from "@/utils/date";

import { TrainingCalendarWeekView } from "../training-calendar-week/training-calendar-week";

import type { FC } from "react";

type Props = {
  year: Year;
  month: Month;
  today: Date;
  selected: Date;
};
export const TrainingCalendarMonth: FC<Props> = (props) => {
  // TODO: 日付だけ取得するquery作る
  const trainingQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: props.year,
    month: props.month,
  });

  switch (trainingQuery.status) {
    case "loading":
    case "success":
      return (
        <TrainingCalendarMonthView
          year={props.year}
          month={props.month}
          today={props.today}
          selected={props.selected}
          trainingDates={
            trainingQuery.data?.map((training) => training.createdAt) ?? []
          }
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  year: Year;
  month: Month;
  today: Date;
  selected: Date;
  trainingDates: Date[];
};
export const TrainingCalendarMonthView: FC<ViewProps> = (props) => {
  // 6週間表示
  const weeks = [0, 1, 2, 3, 4, 5] as const;
  // その月の1日のDate
  const startOfMonthDate = startOfMonth(new Date(props.year, props.month, 1));
  // カレンダーの左上のマスのDate
  const topLeftDate = subDays(startOfMonthDate, getDay(startOfMonthDate));

  return (
    <Stack direction="column">
      {weeks.map((week) => {
        const start = addDays(topLeftDate, week * 7);

        return (
          <Box key={week}>
            <Divider mb={2} />
            <TrainingCalendarWeekView
              start={start}
              today={props.today}
              month={props.month}
              trainingDates={props.trainingDates}
              selected={props.selected}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
