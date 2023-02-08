import { CheckIcon } from "@chakra-ui/icons";
import { Box, Divider, Stack } from "@chakra-ui/react";
import {
  addDays,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  startOfMonth,
  subDays,
} from "date-fns";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Month, Year } from "@/utils/date";

import type { FC } from "react";

type Props = {
  year: Year;
  month: Month;
  today: Date;
};
export const TrainingMonthlyCalendar: FC<Props> = (props) => {
  // TODO: 日付だけ取得するquery作る
  const trainingQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: props.year,
    month: props.month,
  });

  switch (trainingQuery.status) {
    case "loading":
      return <Loading description="トレーニングデータを取得中です" />;
    case "success":
      return (
        <TrainingMonthlyCalendarView
          year={props.year}
          month={props.month}
          today={props.today}
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
  year: Year;
  month: Month;
  today: Date;
  trainingDates: Date[];
};
export const TrainingMonthlyCalendarView: FC<ViewProps> = (props) => {
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
        const month = getMonth(startOfMonthDate) as Month;

        return (
          <Box key={week}>
            <Divider mb={2} />
            <Week
              start={start}
              today={props.today}
              month={month}
              trainingDates={props.trainingDates}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

type WeekProps = {
  start: Date;
  today: Date;
  month: Month;
  trainingDates: Date[];
};
const Week: FC<WeekProps> = (props) => {
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

        return (
          <DateComponent
            key={day}
            date={date}
            isToday={isToday}
            isThisMonth={isThisMonth}
            isTrainingExist={isTrainingExist}
          />
        );
      })}
    </Stack>
  );
};

type DateProps = {
  date: Date;
  isToday: boolean;
  isThisMonth: boolean;
  isTrainingExist: boolean;
};
const DateComponent: FC<DateProps> = (props) => {
  const datePath = format(props.date, "yyyy-MM-dd");

  return (
    <Stack
      as={NextLink}
      href={pagesPath.trainings.dates._date(datePath).$url()}
      h={16}
      direction="column"
      alignItems="center"
    >
      <Box
        w={8}
        h={8}
        lineHeight={8}
        borderRadius="50%"
        textAlign="center"
        bgColor={props.isToday ? "gray.100" : undefined}
        color={!props.isThisMonth ? "gray.300" : undefined}
      >
        {getDate(props.date)}
      </Box>
      {props.isTrainingExist && <CheckIcon color="teal" />}
    </Stack>
  );
};
