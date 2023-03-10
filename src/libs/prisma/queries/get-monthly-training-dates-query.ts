import { endOfMonth, startOfMonth } from "date-fns";

import type { Month, Year } from "@/utils/date";

import prisma from "../client";

export type GetMonthlyTrainingDatesQuery = (props: {
  traineeId: string;
  year: Year;
  month: Month;
}) => Promise<Date[]>;
export const getMonthlyTrainingDatesQuery: GetMonthlyTrainingDatesQuery =
  async (props) => {
    const monthDate = new Date(props.year, props.month, 1);
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const trainingDates = await prisma.training.findMany({
      where: {
        traineeId: props.traineeId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
      },
    });

    return trainingDates.map((trainingDate) => trainingDate.createdAt);
  };
