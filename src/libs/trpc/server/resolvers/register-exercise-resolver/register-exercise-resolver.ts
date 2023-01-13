import { TRPCError } from "@trpc/server";

import { RegisterExerciseCommand } from "@/libs/prisma/commands/register-exercise-command";
import { GetMusclesByIdsQuery } from "@/libs/prisma/queries/get-muscles-by-ids-query";

import { Exercise } from "@/features/exercise/exercise";

type RegisterExerciseResolver = (
  deps: Deps
) => (props: Props) => Promise<Exercise>;
export type Deps = {
  getMusclesByIdsQuery: GetMusclesByIdsQuery;
  registerExerciseCommand: RegisterExerciseCommand;
};
export type Props = {
  name: string;
  musclesIds: string[];
  traineeId: string;
};
export const registerExerciseResolver: RegisterExerciseResolver =
  (deps) => async (props) => {
    const musclesData = await deps.getMusclesByIdsQuery({
      ids: props.musclesIds,
    });
    const isValid = musclesData.length === props.musclesIds.length;

    if (!isValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const registered = await deps.registerExerciseCommand({
      name: props.name,
      musclesIds: props.musclesIds,
      traineeId: props.traineeId,
    });

    return registered;
  };
