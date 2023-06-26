import { addDays, endOfDay, startOfDay } from "date-fns";

import prisma from "../client";

export type GetWeeklyTrainingDatesQuery = (props: {
  traineeId: string;
  start: Date;
}) => Promise<Date[]>;
export const getWeeklyTrainingDatesQuery: GetWeeklyTrainingDatesQuery = async (
  props
) => {
  const start = startOfDay(props.start);
  const end = endOfDay(addDays(props.start, 6));
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
