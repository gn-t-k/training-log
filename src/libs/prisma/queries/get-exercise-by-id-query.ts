import { Exercise, Muscle } from "@prisma/client";

import prisma from "../client";

export type GetExerciseByIdQuery = (props: {
  id: string;
}) => Promise<(Exercise & { targets: Muscle[] }) | null>;
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
