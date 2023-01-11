import { Muscle } from "@prisma/client";

import prisma from "../client";

export type GetMusclesByIdsQuery = (props: {
  ids: string[];
}) => Promise<Muscle[]>;
export const getMusclesByIdsQuery: GetMusclesByIdsQuery = async ({ ids }) => {
  const musclesData = await prisma.muscle.findMany({
    where: {
      id: { in: ids },
    },
  });

  return musclesData;
};
