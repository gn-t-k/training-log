import prisma from "../client";

import type { Trainee } from "@/_features/trainee/trainee";

export type GetTraineeByAuthUserIdQuery = (props: {
  authUserId: string;
}) => Promise<Trainee | null>;
export const getTraineeByAuthUserIdQuery: GetTraineeByAuthUserIdQuery = async ({
  authUserId,
}) => {
  const traineeData = await prisma.trainee.findUnique({
    where: {
      authUserId,
    },
  });

  return traineeData;
};
