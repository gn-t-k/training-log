import { Exercise } from "@/features/exercise/exercise";

import prisma from "../client";

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
