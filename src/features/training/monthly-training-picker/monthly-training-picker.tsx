import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Heading, Spacer, Stack } from "@chakra-ui/react";
import { useCallback } from "react";

import type { Month, Year } from "@/utils/date";

import { TrainingMonthlyCalendar } from "../monthly-training-calendar/monthly-training-calendar";
import { useMonthlyCalendar } from "../monthly-training-calendar/use-monthly-calendar";

import type { FC, MouseEventHandler } from "react";

export const MonthlyTrainingPicker: FC = () => {
  const today = new Date();
  const [{ year, month }, { next, prev }] = useMonthlyCalendar({
    today,
  });

  return (
    <MonthlyTrainingPickerView
      today={today}
      TrainingMonthlyCalendar={
        <TrainingMonthlyCalendar year={year} month={month} today={today} />
      }
      year={year}
      month={month}
      next={next}
      prev={prev}
    />
  );
};

type ViewProps = {
  today: Date;
  TrainingMonthlyCalendar: JSX.Element;
  year: Year;
  month: Month;
  next: () => void;
  prev: () => void;
};
export const MonthlyTrainingPickerView: FC<ViewProps> = (props) => {
  const onClickNext = useCallback<MouseEventHandler>(
    (_) => {
      props.next();
    },
    [props]
  );
  const onClickPrev = useCallback<MouseEventHandler>(
    (_) => {
      props.prev();
    },
    [props]
  );

  return (
    <Stack direction="column">
      <Stack direction="row">
        <Heading size="lg">
          {props.year}年{props.month + 1}月
        </Heading>
        <Spacer />
        <Button onClick={onClickPrev}>
          <ChevronLeftIcon />
        </Button>
        <Button onClick={onClickNext}>
          <ChevronRightIcon />
        </Button>
      </Stack>
      {props.TrainingMonthlyCalendar}
    </Stack>
  );
};
