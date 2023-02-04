import { Box, Stack } from "@chakra-ui/react";
import { addDays, getDate, getDay, startOfMonth, subDays } from "date-fns";

import type { FC } from "react";

export const TrainingCalendar: FC = () => {
  const today = new Date();

  return <TrainingCalendarView today={today} />;
};

type ViewProps = {
  today: Date;
};
export const TrainingCalendarView: FC<ViewProps> = (props) => {
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

        return <Week key={week} start={start} />;
      })}
    </Stack>
  );
};

type WeekProps = {
  start: Date;
};
const Week: FC<WeekProps> = (props) => {
  const days = [0, 1, 2, 3, 4, 5, 6] as const;

  return (
    <Stack direction="row">
      {days.map((day) => {
        return (
          <Box key={day} w={8} h={8} textAlign="end">
            {getDate(addDays(props.start, day))}
          </Box>
        );
      })}
    </Stack>
  );
};
