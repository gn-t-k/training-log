import prisma from "../client";

import type { Trainee } from "@/_features/trainee/trainee";

export type GetTraineeByIdQuery = (props: {
  id: string;
}) => Promise<Trainee | null>;
export const getTraineeByIdQuery: GetTraineeByIdQuery = async (props) => {
  const traineeData = await prisma.trainee.findUnique({
    where: {
      id: props.id,
    },
  });

  return traineeData;
};
