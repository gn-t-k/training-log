import { Muscle } from "@prisma/client";

import prisma from "../client";

export type DeleteMuscleCommand = (props: { id: string }) => Promise<Muscle>;
export const deleteMuscleCommand: DeleteMuscleCommand = async ({ id }) => {
  const deleted = await prisma.muscle.delete({
    where: {
      id,
    },
  });

  return deleted;
};
