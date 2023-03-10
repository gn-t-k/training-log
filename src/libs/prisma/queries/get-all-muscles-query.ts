import prisma from "../client";

import type { Muscle } from "@/features/muscle/muscle";
import type { Trainee } from "@/features/trainee/trainee";


export type GetAllMusclesQuery = (props: {
  trainee: Trainee;
}) => Promise<Muscle[]>;
export const getAllMusclesQuery: GetAllMusclesQuery = async (props) => {
  const musclesData = await prisma.muscle.findMany({
    where: {
      traineeId: props.trainee.id,
    },
  });

  return musclesData;
};
