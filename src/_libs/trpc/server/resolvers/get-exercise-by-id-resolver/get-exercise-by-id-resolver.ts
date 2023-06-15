import { TRPCError } from "@trpc/server";

import type { Exercise } from "@/_features/exercise/exercise";
import type { GetExerciseByIdQuery } from "@/_libs/prisma/queries/get-exercise-by-id-query";


type GetExerciseByIdResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
};
export type Props = {
  id: string;
  traineeId: string;
};
export const getExerciseByIdResolver: GetExerciseByIdResolver =
  (deps) => async (props) => {
    const exerciseData = await deps.getExerciseByIdQuery({
      id: props.id,
    });

    const isOwnExercise =
      exerciseData !== null && exerciseData.traineeId === props.traineeId;

    if (exerciseData === null || !isOwnExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return exerciseData;
  };
