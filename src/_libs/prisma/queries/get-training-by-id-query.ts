import prisma from "../client";

import type { Training } from "@/_features/training/training";

export type GetTrainingByIdQuery = (props: {
  id: string;
}) => Promise<(Training & { traineeId: string }) | null>;
export const getTrainingByIdQuery: GetTrainingByIdQuery = async (props) => {
  const trainingData = await prisma.training.findUnique({
    where: {
      id: props.id,
    },
    include: {
      records: {
        include: {
          exercise: {
            include: {
              targets: true,
            },
          },
          sets: true,
        },
      },
    },
  });

  return trainingData;
};
