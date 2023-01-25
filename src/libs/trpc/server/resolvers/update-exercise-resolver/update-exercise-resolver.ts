import { TRPCError } from "@trpc/server";

import { UpdateExerciseNameCommand } from "@/libs/prisma/commands/update-exercise-name-command";
import { UpdateExerciseTargetsCommand } from "@/libs/prisma/commands/update-exercise-targets-command";
import { GetExerciseByIdQuery } from "@/libs/prisma/queries/get-exercise-by-id-query";
import { GetMusclesByIdsQuery } from "@/libs/prisma/queries/get-muscles-by-ids-query";

import { Exercise } from "@/features/exercise/exercise";
import { Trainee } from "@/features/trainee/trainee";

type UpdateExerciseResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  getExerciseByIdQuery: GetExerciseByIdQuery;
  getMusclesByIdsQuery: GetMusclesByIdsQuery;
  updateExerciseNameCommand: UpdateExerciseNameCommand;
  updateExerciseTargetsCommand: UpdateExerciseTargetsCommand;
};
export type Props = {
  before: Exercise;
  after: Exercise;
  trainee: Trainee;
};
export const updateExerciseResolver: UpdateExerciseResolver =
  (deps) => async (props) => {
    if (props.before.id !== props.after.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const exerciseData = await deps.getExerciseByIdQuery({
      id: props.before.id,
    });
    const isOwnExercise =
      exerciseData !== null && exerciseData.traineeId === props.trainee.id;
    if (!isOwnExercise) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    if (props.before.name !== props.after.name) {
      await deps.updateExerciseNameCommand({
        before: props.before,
        after: props.after,
      });
    }

    const beforeTargetIds = props.before.targets.map((target) => target.id);
    const afterTargetIds = props.after.targets.map((target) => target.id);
    const isSameTargets =
      beforeTargetIds.length === afterTargetIds.length &&
      beforeTargetIds.every((beforeId) => afterTargetIds.includes(beforeId));
    if (!isSameTargets) {
      await deps.updateExerciseTargetsCommand({
        before: props.before,
        after: props.after,
      });
    }
  };
