import { Trainee } from "@prisma/client";

import prisma from "../client";

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
