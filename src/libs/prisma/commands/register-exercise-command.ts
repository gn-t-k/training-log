import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";

import prisma from "../client";

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
