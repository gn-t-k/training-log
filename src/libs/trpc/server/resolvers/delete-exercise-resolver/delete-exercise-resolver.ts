import { TRPCError } from "@trpc/server";

import { DeleteExerciseCommand } from "@/libs/prisma/commands/delete-exercise-command";
import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";

import { Exercise } from "@/features/exercise/exercise";

type DeleteExerciseResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
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

    const isOtherTraineesExercise =
      exerciseData !== null && exerciseData.traineeId !== props.traineeId;

    if (exerciseData === null || isOtherTraineesExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const deleted = await deps.deleteExerciseCommand({ id: props.id });

    return deleted;
  };
