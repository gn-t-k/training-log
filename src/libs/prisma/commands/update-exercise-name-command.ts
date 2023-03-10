import prisma from "../client";

import type { Exercise } from "@/features/exercise/exercise";


export type UpdateExerciseNameCommand = (props: {
  before: Exercise;
  after: Exercise;
}) => Promise<void>;
export const updateExerciseNameCommand: UpdateExerciseNameCommand = async (
  props
) => {
  await prisma.exercise.update({
    where: {
      id: props.before.id,
    },
    data: {
      name: props.after.name,
    },
  });
};
