import { Stack } from "@chakra-ui/react";
import { addDays, getDate, getMonth, getYear } from "date-fns";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Month, Year } from "@/utils/date";

import { TrainingCalendarDate } from "../training-calendar-date/training-calendar-date";

import type { FC } from "react";

type Props = {
  start: Date;
  today: Date;
  year: Year;
  month: Month;
  selected: Date;
};
export const TrainingCalendarWeek: FC<Props> = (props) => {
  // TODO: 日付だけ取得するquery作る
  // TODO: 前後の月もとらないと表示おかしくなる
  const trainingQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: props.year,
    month: props.month,
  });

  switch (trainingQuery.status) {
    case "loading":
      return <Loading description="トレーニングデータを取得中です" />;
    case "success":
      return (
        <TrainingCalendarWeekView
          start={props.start}
          today={props.today}
          month={props.month}
          selected={props.selected}
          trainingDates={trainingQuery.data.map(
            (training) => training.createdAt
          )}
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  start: Date;
  today: Date;
  month: Month;
  selected: Date;
  trainingDates: Date[];
};
export const TrainingCalendarWeekView: FC<ViewProps> = (props) => {
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  return (
    <Stack direction="row" justifyContent="space-around">
      {days.map((day) => {
        const isDateEqual = (a: Date, b: Date): boolean =>
          getYear(a) === getYear(b) &&
          getMonth(a) === getMonth(b) &&
          getDate(a) === getDate(b);

        const date = addDays(props.start, day);
        const isToday = isDateEqual(date, props.today);
        const isThisMonth = getMonth(date) === props.month;
        const isTrainingExist =
          props.trainingDates.find((trainingDate) =>
            isDateEqual(trainingDate, date)
          ) !== undefined;
        const isSelected = isDateEqual(date, props.selected);

        return (
          <TrainingCalendarDate
            key={day}
            date={date}
            isToday={isToday}
            isThisMonth={isThisMonth}
            isTrainingExist={isTrainingExist}
            isSelected={isSelected}
          />
        );
      })}
    </Stack>
  );
};
