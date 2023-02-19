import prisma from "../client";

import type { Set } from "@/features/training/training";

export type GetSetsByExerciseIdQuery = (props: {
  exerciseId: string;
}) => Promise<{ sets: Set[]; traineeId: string | null }>;
export const getSetsByExerciseIdQuery: GetSetsByExerciseIdQuery = async (
  props
) => {
  const trainings = await prisma.training.findMany({
    where: {
      records: {
        some: {
          exerciseId: props.exerciseId,
        },
      },
    },
    select: {
      traineeId: true,
      records: {
        where: {
          exerciseId: props.exerciseId,
        },
        select: {
          sets: {
            select: {
              id: true,
              weight: true,
              repetition: true,
            },
          },
        },
      },
    },
  });

  if (trainings[0] === undefined) {
    return {
      sets: [],
      traineeId: null,
    };
  }
  const traineeId = trainings[0].traineeId;

  return {
    sets: trainings
      .flatMap((training) => training.records)
      .flatMap((record) => record.sets),
    traineeId,
  };
};
