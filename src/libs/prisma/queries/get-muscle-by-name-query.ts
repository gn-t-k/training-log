import { Muscle } from "@prisma/client";

import prisma from "../client";

export type GetMuscleByNameQuery = (props: {
  name: string;
  traineeId: string;
}) => Promise<Muscle | null>;
export const getMuscleByNameQuery: GetMuscleByNameQuery = async ({
  name,
  traineeId,
}) => {
  const muscleData = await prisma.muscle.findUnique({
    where: {
      name_traineeId: {
        name,
        traineeId,
      },
    },
  });

  return muscleData;
};
