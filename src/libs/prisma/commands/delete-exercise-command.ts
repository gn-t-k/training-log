import prisma from "../client";

import type { Exercise } from "@/features/exercise/exercise";


export type DeleteExerciseCommand = (props: {
  exercise: Exercise;
}) => Promise<void>;
export const deleteExerciseCommand: DeleteExerciseCommand = async (props) => {
  await prisma.exercise.delete({
    where: {
      id: props.exercise.id,
    },
  });
};
