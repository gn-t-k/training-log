import { endOfMonth, startOfMonth } from "date-fns";

import { Month, Year } from "@/utils/date";

import { Training } from "@/features/training/training";

import prisma from "../client";

export type GetMonthlyTrainingsQuery = (props: {
  year: Year;
  month: Month;
  traineeId: string;
}) => Promise<Training[]>;
export const getMonthlyTrainingsQuery: GetMonthlyTrainingsQuery = async (
  props
) => {
  const date = new Date(props.year, props.month);
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const trainingsData = await prisma.training.findMany({
    where: {
      traineeId: props.traineeId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: {
      records: {
        include: {
          exercise: {
            include: {
              targets: true,
            },
          },
          sets: true,
        },
      },
    },
  });

  return trainingsData;
};
