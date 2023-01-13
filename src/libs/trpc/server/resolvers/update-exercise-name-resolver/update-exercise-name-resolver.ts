import { TRPCError } from "@trpc/server";

import { UpdateExerciseNameCommand } from "@/libs/prisma/commands/update-exercise-name-command";
import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";

import { Exercise } from "@/features/exercise/exercise";

type UpdateExerciseNameResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
  updateExerciseNameCommand: UpdateExerciseNameCommand;
};
export type Props = {
  id: string;
  name: string;
  traineeId: string;
};
export const updateExerciseNameResolver: UpdateExerciseNameResolver =
  (deps) => async (props) => {
    const exerciseData = await deps.getExerciseByIdQuery({ id: props.id });

    const isOwnMuscle =
      exerciseData !== null && exerciseData.traineeId === props.traineeId;

    if (exerciseData === null || !isOwnMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const updated = await deps.updateExerciseNameCommand({
      id: props.id,
      name: props.name,
    });

    return updated;
  };
