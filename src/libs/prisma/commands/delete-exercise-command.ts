import { Exercise, Muscle } from "@prisma/client";

import prisma from "../client";

export type DeleteExerciseCommand = (props: {
  id: string;
}) => Promise<Exercise & { targets: Muscle[] }>;
export const deleteExerciseCommand: DeleteExerciseCommand = async (props) => {
  const deleted = await prisma.exercise.delete({
    where: {
      id: props.id,
    },
    include: {
      targets: true,
    },
  });

  return deleted;
};
