import { Exercise, Muscle } from "@prisma/client";
import { ulid } from "ulid";

import prisma from "../client";

export type RegisterExerciseCommand = (props: {
  name: string;
  musclesIds: string[];
  traineeId: string;
}) => Promise<Exercise & { targets: Muscle[] }>;
export const registerExerciseCommand: RegisterExerciseCommand = async (
  props
) => {
  const registered = await prisma.exercise.create({
    data: {
      id: ulid(),
      name: props.name,
      targets: {
        connect: props.musclesIds.map((id) => ({ id })),
      },
      traineeId: props.traineeId,
    },
    include: {
      targets: true,
    },
  });

  return registered;
};
