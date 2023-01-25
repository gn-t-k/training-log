import { Trainee } from "@/features/trainee/trainee";

import prisma from "../client";

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
