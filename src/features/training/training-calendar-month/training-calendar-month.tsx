import { Box, Divider, Stack } from "@chakra-ui/react";
import {
  addDays,
  addMinutes,
  addMonths,
  getDay,
  getMonth,
  getYear,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { useMemo } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

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
  const { useQuery } = trpc.training.getMonthlyTrainingDates;
  const monthDate = new Date(props.year, props.month, 1);
  const utcDate = addMinutes(monthDate, monthDate.getTimezoneOffset());
  const lastMonth = subMonths(utcDate, 1);
  const nextMonth = addMonths(utcDate, 1);
  const [lastMonthYear, lastMonthMonth] = [
    getYear(lastMonth),
    getMonth(lastMonth) as Month,
  ];
  const [thisMonthYear, thisMonthMonth] = [
    getYear(utcDate),
    getMonth(utcDate) as Month,
  ];
  const [nextMonthYear, nextMonthMonth] = [
    getYear(nextMonth),
    getMonth(nextMonth) as Month,
  ];
  const lastMonthTrainingDatesQuery = useQuery({
    year: lastMonthYear,
    month: lastMonthMonth,
  });
  const thisMonthTrainingDatesQuery = useQuery({
    year: thisMonthYear,
    month: thisMonthMonth,
  });
  const nextMonthTrainingDatesQuery = useQuery({
    year: nextMonthYear,
    month: nextMonthMonth,
  });
  const trainingDates = useMemo<Date[]>(() => {
    const lastMonth = lastMonthTrainingDatesQuery.data ?? [];
    const thisMonth = thisMonthTrainingDatesQuery.data ?? [];
    const nextMonth = nextMonthTrainingDatesQuery.data ?? [];

    return [...lastMonth, ...thisMonth, ...nextMonth];
  }, [
    lastMonthTrainingDatesQuery.data,
    nextMonthTrainingDatesQuery.data,
    thisMonthTrainingDatesQuery.data,
  ]);

  if (
    lastMonthTrainingDatesQuery.isError ||
    thisMonthTrainingDatesQuery.isError ||
    nextMonthTrainingDatesQuery.isError
  ) {
    // TODO
    return <p>トレーニングデータの取得に失敗しました</p>;
  }

  if (
    lastMonthTrainingDatesQuery.isLoading ||
    thisMonthTrainingDatesQuery.isLoading ||
    nextMonthTrainingDatesQuery.isLoading
  ) {
    return <Loading description="トレーニング記録を取得しています" />;
  }

  return (
    <TrainingCalendarMonthView
      year={props.year}
      month={props.month}
      today={props.today}
      selected={props.selected}
      trainingDates={trainingDates}
    />
  );
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
      {weeks.map((week, index) => {
        const start = addDays(topLeftDate, week * 7);

        return (
          <Box key={week}>
            {index !== 0 && <Divider mb={2} />}
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
