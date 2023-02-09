import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Heading, Spacer, Stack } from "@chakra-ui/react";
import { addDays, format, getDay, getMonth, subDays } from "date-fns";
import NextLink from "next/link";
import { useMemo } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import type { Month } from "@/utils/date";

import { TrainingCalendarWeek } from "../training-calendar-week/training-calendar-week";

import type { FC } from "react";

type Props = {
  selected: Date;
};
export const WeeklyTrainingPicker: FC<Props> = (props) => {
  const today = new Date();
  const start = subDays(props.selected, getDay(props.selected));
  const month = getMonth(props.selected) as Month;

  return (
    <WeeklyTrainingPickerView
      selected={props.selected}
      TrainingCalendarWeek={
        <TrainingCalendarWeek
          start={start}
          today={today}
          month={month}
          selected={props.selected}
        />
      }
    />
  );
};

type ViewProps = {
  selected: Date;
  TrainingCalendarWeek: JSX.Element;
};
export const WeeklyTrainingPickerView: FC<ViewProps> = (props) => {
  const heading = format(props.selected, "yyyy年M月d日");
  const prevUrl = useMemo(() => {
    const prevDate = format(subDays(props.selected, 1), "yyyy-MM-dd");

    return pagesPath.trainings.dates._date(prevDate).$url();
  }, [props.selected]);
  const nextUrl = useMemo(() => {
    const nextDate = format(addDays(props.selected, 1), "yyyy-MM-dd");

    return pagesPath.trainings.dates._date(nextDate).$url();
  }, [props.selected]);

  return (
    <Stack direction="column">
      {props.TrainingCalendarWeek}
      <Stack direction="row" alignItems="center">
        <Button as={NextLink} href={prevUrl}>
          <ChevronLeftIcon />
        </Button>
        <Spacer />
        <Heading size="sm">{heading}</Heading>
        <Spacer />
        <Button as={NextLink} href={nextUrl}>
          <ChevronRightIcon />
        </Button>
      </Stack>
    </Stack>
  );
};
