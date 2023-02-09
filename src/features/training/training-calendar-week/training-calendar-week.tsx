import { Stack } from "@chakra-ui/react";
import { addDays, getDate, getMonth, getYear } from "date-fns";

import type { Month } from "@/utils/date";

import { TrainingCalendarDate } from "../training-calendar-date/training-calendar-date";

import type { FC } from "react";

type Props = {
  start: Date;
  today: Date;
  month: Month;
  selected: Date;
};
export const TrainingCalendarWeek: FC<Props> = (props) => {
  const trainingDates: Date[] = []; // TODO

  return (
    <TrainingCalendarWeekView
      start={props.start}
      today={props.today}
      month={props.month}
      selected={props.selected}
      trainingDates={trainingDates}
    />
  );
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
