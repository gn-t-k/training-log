import { Training } from "@/features/training/training";

import prisma from "../client";

export type GetMonthlyTrainingsQuery = (props: {
  start: Date;
  end: Date;
  traineeId: string;
}) => Promise<Training[]>;
export const getMonthlyTrainingsQuery: GetMonthlyTrainingsQuery = async (
  props
) => {
  // const date = new Date(props.year, props.month);
  // const start = startOfMonth(date);
  // const end = endOfMonth(date);
  const trainingsData = await prisma.training.findMany({
    where: {
      traineeId: props.traineeId,
      createdAt: {
        gte: props.start,
        lte: props.end,
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
