import { Muscle } from "@prisma/client";

import prisma from "../client";

export type GetMuscleByIdQuery = (props: {
  id: string;
}) => Promise<Muscle | null>;
export const getMuscleByIdQuery: GetMuscleByIdQuery = async ({ id }) => {
  const muscle = await prisma.muscle.findUnique({
    where: {
      id,
    },
  });

  return muscle;
};
