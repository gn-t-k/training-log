import { CheckIcon } from "@chakra-ui/icons";
import { Box, Stack } from "@chakra-ui/react";
import {
  // format,
  getDate,
} from "date-fns";
import NextLink from "next/link";
import { useMemo } from "react";

import { pagesPath } from "@/_libs/pathpida/$path";

import type { BoxProps } from "@chakra-ui/react";
import type { FC } from "react";

type Props = {
  date: Date;
  isToday: boolean;
  isThisMonth: boolean;
  isTrainingExist: boolean;
  isSelected: boolean;
};
export const TrainingCalendarDate: FC<Props> = (props) => {
  return <TrainingCalendarDateView {...props} />;
};

type ViewProps = {
  date: Date;
  isToday: boolean;
  isThisMonth: boolean;
  isTrainingExist: boolean;
  isSelected: boolean;
};
export const TrainingCalendarDateView: FC<ViewProps> = (props) => {
  // const datePath = format(props.date, "yyyy-MM-dd");

  const todayProps = useMemo<BoxProps>(
    () =>
      props.isToday
        ? {
            fontWeight: "bold",
            color: "teal",
          }
        : {},
    [props.isToday]
  );
  const selectedProps = useMemo<BoxProps>(
    () =>
      props.isSelected
        ? {
            bgColor: "gray.100",
          }
        : {},
    [props.isSelected]
  );
  const otherMonthProps = useMemo<BoxProps>(
    () =>
      !props.isThisMonth
        ? {
            color: "gray.300",
          }
        : {},
    [props.isThisMonth]
  );

  return (
    <Stack
      as={NextLink}
      // href={pagesPath.trainings.dates._date(datePath).$url()}
      href={pagesPath.$url()}
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
        {...todayProps}
        {...selectedProps}
        {...otherMonthProps}
      >
        {getDate(props.date)}
      </Box>
      {props.isTrainingExist && <CheckIcon color="teal" />}
    </Stack>
  );
};
