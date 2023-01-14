import { Exercise, Muscle, Training, TrainingSet } from "@prisma/client";
import { ulid } from "ulid";

import prisma from "../client";

export type RegisterTrainingCommand = (props: {
  traineeId: string;
  todaysDate: Date;
  trainingSets: {
    exerciseId: string;
    weight: number;
    repetition: number;
  }[];
}) => Promise<
  Training & {
    trainingSets: (TrainingSet & {
      exercise: Exercise & { targets: Muscle[] };
    })[];
  }
>;
export const registerTrainingCommand: RegisterTrainingCommand = async (
  props
) => {
  const registered = await prisma.training.create({
    data: {
      id: ulid(),
      traineeId: props.traineeId,
      createdAt: props.todaysDate,
      updatedAt: props.todaysDate,
      trainingSets: {
        createMany: {
          data: props.trainingSets.map((trainingSet) => ({
            id: ulid(),
            exerciseId: trainingSet.exerciseId,
            weight: trainingSet.weight,
            repetition: trainingSet.weight,
          })),
        },
      },
    },
    include: {
      trainingSets: {
        include: {
          exercise: {
            include: {
              targets: true,
            },
          },
        },
      },
    },
  });

  return registered;
};
