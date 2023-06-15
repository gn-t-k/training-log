import prisma from "../client";

import type { Exercise } from "@/_features/exercise/exercise";

export type GetExerciseByIdQuery = (props: {
  id: string;
}) => Promise<(Exercise & { traineeId: string }) | null>;
export const getExerciseByIdQuery: GetExerciseByIdQuery = async (props) => {
  const exerciseData = await prisma.exercise.findUnique({
    where: {
      id: props.id,
    },
    include: {
      targets: true,
    },
  });

  return exerciseData;
};
