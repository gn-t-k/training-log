import { TRPCError } from "@trpc/server";

import type { GetSetsByExerciseIdQuery } from "@/libs/prisma/queries/get-sets-by-exercise-id-query";

import { getEstimatedMaximumWeight } from "@/features/training/getEstimatedMaximumWeight/getEstimatedMaximumWeight";

type GetEstimatedMaximumWeightResolver = (
  deps: Deps
) => (props: Props) => Promise<number | null>;
export type Deps = {
  getSetsByExerciseIdQuery: GetSetsByExerciseIdQuery;
};
export type Props = {
  exerciseId: string;
  traineeId: string;
};
export const getEstimatedMaximumWeightResolver: GetEstimatedMaximumWeightResolver =
  (deps) => async (props) => {
    const setsAndTraineeId = await deps.getSetsByExerciseIdQuery({
      exerciseId: props.exerciseId,
    });

    if (setsAndTraineeId.traineeId === null) {
      return null;
    }

    if (setsAndTraineeId.traineeId !== props.traineeId) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const { sets } = setsAndTraineeId;
    const estimatedMaximumWeight = sets
      .map((set) => getEstimatedMaximumWeight(set))
      .sort((left, right) => right - left)[0];

    return estimatedMaximumWeight ?? null;
  };
