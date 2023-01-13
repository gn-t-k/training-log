import { TRPCError } from "@trpc/server";

import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";

import { Exercise } from "@/features/exercise/exercise";

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
