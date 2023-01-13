import { Exercise, Muscle } from "@prisma/client";

import prisma from "../client";

export type UpdateExerciseNameCommand = (props: {
  id: string;
  name: string;
}) => Promise<Exercise & { targets: Muscle[] }>;
export const updateExerciseNameCommand: UpdateExerciseNameCommand = async (
  props
) => {
  const updated = await prisma.exercise.update({
    where: {
      id: props.id,
    },
    data: {
      name: props.name,
    },
    include: {
      targets: true,
    },
  });

  return updated;
};
