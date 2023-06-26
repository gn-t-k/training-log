import { endOfDay, startOfDay } from "date-fns";

import prisma from "../client";

import type { Training } from "@/features/training/training";

export type GetTrainingsByDateQuery = (props: {
  traineeId: string;
  date: Date;
}) => Promise<Training[]>;
export const getTrainingsByDateQuery: GetTrainingsByDateQuery = async (
  props
) => {
  const start = startOfDay(props.date);
  const end = endOfDay(props.date);
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
