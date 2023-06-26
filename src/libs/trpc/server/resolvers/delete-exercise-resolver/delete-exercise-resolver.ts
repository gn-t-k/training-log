import { TRPCError } from "@trpc/server";

import type { DeleteExerciseCommand } from "@/libs/prisma/commands/delete-exercise-command";
import type { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";

type DeleteExerciseResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
  deleteExerciseCommand: DeleteExerciseCommand;
};
export type Props = {
  id: string;
  traineeId: string;
};
export const deleteExerciseResolver: DeleteExerciseResolver =
  (deps) => async (props) => {
    const exerciseData = await deps.getExerciseByIdQuery({ id: props.id });

    const isOwnExercise =
      exerciseData !== null && exerciseData.traineeId === props.traineeId;

    if (exerciseData === null || !isOwnExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const deleted = await deps.deleteExerciseCommand({
      exercise: exerciseData,
    });

    return deleted;
  };
