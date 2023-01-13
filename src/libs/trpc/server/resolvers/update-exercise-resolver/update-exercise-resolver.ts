import { TRPCError } from "@trpc/server";

import { UpdateExerciseCommand } from "@/libs/prisma/commands/update-exercise-command";
import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";
import { GetMusclesByIdsQuery } from "@/libs/prisma/queries/get-muscles-by-ids-query";

import { Exercise } from "@/features/exercise/exercise";

type UpdateExerciseResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
  getMusclesByIdsQuery: GetMusclesByIdsQuery;
  updateExerciseCommand: UpdateExerciseCommand;
};
export type Props = {
  id: string;
  traineeId: string;
  name: string;
  targetIds: string[];
};
export const updateExerciseResolver: UpdateExerciseResolver =
  (deps) => async (props) => {
    const currentExerciseData = await deps.getExerciseByIdQuery({
      id: props.id,
    });
    const isOwnExercise =
      currentExerciseData !== null &&
      currentExerciseData.traineeId === props.traineeId;

    if (currentExerciseData === null || !isOwnExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const musclesData = await deps.getMusclesByIdsQuery({
      ids: props.targetIds,
    });
    const isValidTargets = musclesData.length === props.targetIds.length;
    const isOwnMuscles = musclesData.every(
      (muscle) => muscle.traineeId === props.traineeId
    );

    if (!isValidTargets || !isOwnMuscles) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const updated = await deps.updateExerciseCommand({
      id: props.id,
      name: props.name,
      musclesIds: {
        before: currentExerciseData.targets.map((target) => target.id),
        after: props.targetIds,
      },
    });

    return updated;
  };
