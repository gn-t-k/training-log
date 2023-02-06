import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import {
  addDays,
  getDate,
  getDay,
  getMonth,
  getYear,
  startOfMonth,
  subDays,
} from "date-fns";
import { useCallback } from "react";

import type { Month } from "@/utils/date";

import { useMonthlyCalendar } from "./use-monthly-calendar";

import type { FC, MouseEventHandler } from "react";

export const TrainingMonthlyCalendar: FC = () => {
  const today = new Date();

  return <TrainingMonthlyCalendarView today={today} />;
};

type ViewProps = {
  today: Date;
};
export const TrainingMonthlyCalendarView: FC<ViewProps> = (props) => {
  const [{ year, month }, { next, prev }] = useMonthlyCalendar({
    today: props.today,
  });

  // 6週間表示
  const weeks = [0, 1, 2, 3, 4, 5] as const;
  // その月の1日のDate
  const startOfMonthDate = startOfMonth(new Date(year, month, 1));
  // カレンダーの左上のマスのDate
  const topLeftDate = subDays(startOfMonthDate, getDay(startOfMonthDate));

  const onClickNext = useCallback<MouseEventHandler>(
    (_) => {
      next();
    },
    [next]
  );
  const onClickPrev = useCallback<MouseEventHandler>(
    (_) => {
      prev();
    },
    [prev]
  );

  return (
    <Stack direction="column">
      <Stack direction="row">
        <Heading size="lg">
          {year}年{month + 1}月
        </Heading>
        <Button onClick={onClickPrev}>
          <ChevronLeftIcon />
        </Button>
        <Button onClick={onClickNext}>
          <ChevronRightIcon />
        </Button>
      </Stack>
      {weeks.map((week) => {
        const start = addDays(topLeftDate, week * 7);
        const month = getMonth(startOfMonthDate) as Month;

        return (
          <Week key={week} start={start} today={props.today} month={month} />
        );
      })}
    </Stack>
  );
};

type WeekProps = {
  start: Date;
  today: Date;
  month: Month;
};
const Week: FC<WeekProps> = (props) => {
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  return (
    <Stack direction="row">
      {days.map((day) => {
        const date = addDays(props.start, day);
        const isToday =
          getYear(date) === getYear(props.today) &&
          getMonth(date) === getMonth(props.today) &&
          getDate(date) === getDate(props.today);
        const isThisMonth = getMonth(date) === props.month;

        return (
          <Box
            key={day}
            w={8}
            h={8}
            lineHeight={8}
            borderRadius="50%"
            textAlign="center"
            bgColor={isToday ? "teal" : undefined}
            color={isToday ? "white" : !isThisMonth ? "gray.300" : undefined}
          >
            {getDate(date)}
          </Box>
        );
      })}
    </Stack>
  );
};
