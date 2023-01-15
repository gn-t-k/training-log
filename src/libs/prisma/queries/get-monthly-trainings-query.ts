import {
  Exercise,
  Muscle,
  Training,
  TrainingExercise,
  TrainingExerciseSet,
} from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

import { Month, Year } from "@/utils/date";

import prisma from "../client";

export type GetMonthlyTrainingsQuery = (props: {
  year: Year;
  month: Month;
  traineeId: string;
}) => Promise<
  (Training & {
    exercises: (TrainingExercise & {
      exercise: Exercise & {
        targets: Muscle[];
      };
      sets: TrainingExerciseSet[];
    })[];
  })[]
>;
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
      exercises: {
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
