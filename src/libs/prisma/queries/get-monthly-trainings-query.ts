import prisma from "../client";

import type { Training } from "@/features/training/training";

export type GetMonthlyTrainingsQuery = (props: {
  start: Date;
  end: Date;
  traineeId: string;
}) => Promise<Training[]>;
export const getMonthlyTrainingsQuery: GetMonthlyTrainingsQuery = async (
  props
) => {
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
