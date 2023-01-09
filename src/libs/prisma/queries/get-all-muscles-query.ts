import { Muscle } from "@/features/muscle/muscle";

import prisma from "../client";

export type GetAllMusclesQuery = (props: {
  traineeId: string;
}) => Promise<Muscle[]>;
export const getAllMusclesQuery: GetAllMusclesQuery = async ({ traineeId }) => {
  const musclesData = await prisma.muscle.findMany({
    where: {
      traineeId,
    },
  });

  return musclesData;
};
