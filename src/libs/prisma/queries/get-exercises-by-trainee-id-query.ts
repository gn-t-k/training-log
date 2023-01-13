import { Exercise, Muscle } from "@prisma/client";

import prisma from "../client";

export type GetExercisesByTraineeIdQuery = (props: {
  traineeId: string;
}) => Promise<(Exercise & { targets: Muscle[] })[]>;
export const getExercisesByTraineeIdQuery: GetExercisesByTraineeIdQuery =
  async (props) => {
    const exercisesData = await prisma.exercise.findMany({
      where: {
        traineeId: props.traineeId,
      },
      include: {
        targets: true,
      },
    });

    return exercisesData;
  };
