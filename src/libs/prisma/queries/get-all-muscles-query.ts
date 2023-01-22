import { Muscle } from "@/features/muscle/muscle";
import { Trainee } from "@/features/trainee/trainee";

import prisma from "../client";

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
