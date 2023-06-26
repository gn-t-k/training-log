import prisma from "../client";

import type { Exercise } from "@/features/exercise/exercise";

export type DeleteExerciseCommand = (props: {
  exercise: Exercise;
}) => Promise<void>;
export const deleteExerciseCommand: DeleteExerciseCommand = async (props) => {
  await prisma.$transaction(async (tx) => {
    await tx.record.deleteMany({
      where: {
        exerciseId: props.exercise.id,
      },
    });

    await tx.exercise.delete({
      where: {
        id: props.exercise.id,
      },
    });
  });
};
