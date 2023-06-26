import prisma from "../client";

import type { Exercise } from "@/features/exercise/exercise";


export type GetExercisesByTraineeIdQuery = (props: {
  traineeId: string;
}) => Promise<Exercise[]>;
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
