import { CheckIcon } from "@chakra-ui/icons";
import { Box, Stack } from "@chakra-ui/react";
import {
  addDays,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  subDays,
} from "date-fns";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import type { FC } from "react";

type Props = {
  select: (date: Date) => void;
  selected: Date;
};
export const WeeklyTrainingCalendar: FC<Props> = (props) => {
  const today = new Date();

  return (
    <WeeklyTrainingCalendarView
      selected={props.selected}
      today={today}
      trainingDates={[]} // TODO
    />
  );
};

type ViewProps = {
  selected: Date;
  today: Date;
  trainingDates: Date[];
};
export const WeeklyTrainingCalendarView: FC<ViewProps> = (props) => {
  const start = subDays(props.selected, getDay(props.selected));
  const month = getMonth(props.selected);
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  return (
    <Stack direction="row" justifyContent="space-around">
      {days.map((day) => {
        const isDateEqual = (a: Date, b: Date): boolean =>
          getYear(a) === getYear(b) &&
          getMonth(a) === getMonth(b) &&
          getDate(a) === getDate(b);

        const date = addDays(start, day);
        const isToday = isDateEqual(date, props.today);
        const isThisMonth = getMonth(date) === month;
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
