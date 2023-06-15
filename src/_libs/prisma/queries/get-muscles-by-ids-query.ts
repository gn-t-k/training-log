import prisma from "../client";

import type { Muscle } from "@/_features/muscle/muscle";

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
