import prisma from "../client";

import type { Exercise } from "@/_features/exercise/exercise";
import type { Trainee } from "@/_features/trainee/trainee";

export type RegisterExerciseCommand = (props: {
  exercise: Exercise;
  trainee: Trainee;
}) => Promise<void>;
export const registerExerciseCommand: RegisterExerciseCommand = async (
  props
) => {
  await prisma.exercise.create({
    data: {
      id: props.exercise.id,
      name: props.exercise.name,
      targets: {
        connect: props.exercise.targets.map((target) => ({ id: target.id })),
      },
      traineeId: props.trainee.id,
    },
  });
};
