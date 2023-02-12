import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { addDays, format, getDay, getMonth, getYear, subDays } from "date-fns";
import NextLink from "next/link";
import { useCallback, useEffect, useMemo } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import type { Month } from "@/utils/date";

import { MonthlyTrainingPicker } from "../monthly-training-picker/monthly-training-picker";
import { TrainingCalendarWeek } from "../training-calendar-week/training-calendar-week";

import type { FC, MouseEventHandler } from "react";

type Props = {
  selected: Date;
};
export const WeeklyTrainingPicker: FC<Props> = (props) => {
  const today = new Date();
  const start = subDays(props.selected, getDay(props.selected));
  const year = getYear(props.selected);
  const month = getMonth(props.selected) as Month;

  return (
    <WeeklyTrainingPickerView
      selected={props.selected}
      TrainingCalendarWeek={
        <TrainingCalendarWeek
          start={start}
          today={today}
          year={year}
          month={month}
          selected={props.selected}
        />
      }
      MonthlyTrainingPicker={
        <MonthlyTrainingPicker selected={props.selected} />
      }
    />
  );
};

type ViewProps = {
  selected: Date;
  TrainingCalendarWeek: JSX.Element;
  MonthlyTrainingPicker: JSX.Element;
};
export const WeeklyTrainingPickerView: FC<ViewProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const heading = format(props.selected, "yyyy年M月d日");

  const prevUrl = useMemo(() => {
    const prevDate = format(subDays(props.selected, 1), "yyyy-MM-dd");
    return pagesPath.trainings.dates._date(prevDate).$url();
  }, [props.selected]);
  const nextUrl = useMemo(() => {
    const nextDate = format(addDays(props.selected, 1), "yyyy-MM-dd");
    return pagesPath.trainings.dates._date(nextDate).$url();
  }, [props.selected]);

  useEffect(() => {
    // 日付を選択したらDrawerを閉じる
    onClose();
  }, [onClose, props.selected]);

  const onClickCalendarIcon = useCallback<MouseEventHandler>(
    (_) => {
      onOpen();
    },
    [onOpen]
  );

  return (
    <Box>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody>{props.MonthlyTrainingPicker}</DrawerBody>
        </DrawerContent>
      </Drawer>
      <Stack direction="column">
        {props.TrainingCalendarWeek}
        <Stack direction="row" alignItems="center">
          <Button as={NextLink} href={prevUrl} size="sm">
            <ChevronLeftIcon />
          </Button>
          <Spacer />
          <Heading size="sm">{heading}</Heading>
          <Button size="sm">
            <CalendarIcon onClick={onClickCalendarIcon} />
          </Button>
          <Spacer />
          <Button as={NextLink} href={nextUrl} size="sm">
            <ChevronRightIcon />
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
