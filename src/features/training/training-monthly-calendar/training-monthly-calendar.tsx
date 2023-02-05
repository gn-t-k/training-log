import { Box, Stack } from "@chakra-ui/react";
import {
  addDays,
  getDate,
  getDay,
  getMonth,
  startOfMonth,
  subDays,
} from "date-fns";
// import NextLink from "next/link";

// import { pagesPath } from "@/libs/pathpida/$path";

import type { FC } from "react";

export const TrainingMonthlyCalendar: FC = () => {
  const today = new Date();

  return <TrainingMonthlyCalendarView today={today} />;
};

type ViewProps = {
  today: Date;
};
export const TrainingMonthlyCalendarView: FC<ViewProps> = (props) => {
  // 6週間表示
  const weeks = [0, 1, 2, 3, 4, 5] as const;
  // その月の1日のDate
  const startOfMonthDate = startOfMonth(props.today);
  // カレンダーの左上のマスのDate
  const topLeftDate = subDays(startOfMonthDate, getDay(startOfMonthDate));

  return (
    <Stack direction="column">
      {weeks.map((week) => {
        const start = addDays(topLeftDate, week * 7);

        return <Week key={week} start={start} today={props.today} />;
      })}
    </Stack>
  );
};

type WeekProps = {
  start: Date;
  today: Date;
};
const Week: FC<WeekProps> = (props) => {
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  return (
    <Stack direction="row">
      {days.map((day) => {
        const date = addDays(props.start, day);
        const isToday =
          getDate(date) === getDate(props.today) &&
          getMonth(date) === getMonth(props.today);
        const isThisMonth = getMonth(date) === getMonth(props.today);

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
