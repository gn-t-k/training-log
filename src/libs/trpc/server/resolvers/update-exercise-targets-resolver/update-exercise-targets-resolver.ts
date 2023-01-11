import { TRPCError } from "@trpc/server";

import { UpdateExerciseTargetsCommand } from "@/libs/prisma/commands/update-exercise-targets-command";
import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";
import { GetMusclesByIdsQuery } from "@/libs/prisma/queries/get-muscles-by-ids-query";

import { Exercise } from "@/features/exercise/exercise";

type UpdateExerciseTargetsResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
  getMusclesByIdsQuery: GetMusclesByIdsQuery;
  updateExerciseTargetsCommand: UpdateExerciseTargetsCommand;
};
export type Props = {
  id: string;
  traineeId: string;
  targetIds: string[];
};
export const updateExerciseTargetsResolver: UpdateExerciseTargetsResolver =
  (deps) => async (props) => {
    const currentExerciseData = await deps.getExerciseByIdQuery({
      id: props.id,
    });
    const isOtherTraineesExercise =
      currentExerciseData !== null &&
      currentExerciseData.traineeId !== props.traineeId;

    if (currentExerciseData === null || isOtherTraineesExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const musclesData = await deps.getMusclesByIdsQuery({
      ids: props.targetIds,
    });
    const isValidTargets = musclesData.length === props.targetIds.length;

    if (!isValidTargets) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const updated = await deps.updateExerciseTargetsCommand({
      id: props.id,
      musclesIds: {
        before: currentExerciseData.targets.map((target) => target.id),
        after: props.targetIds,
      },
    });

    return updated;
  };
