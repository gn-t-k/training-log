import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";

import type { Trainee } from "@/_features/trainee/trainee";
import type { RegisterExerciseCommand } from "@/_libs/prisma/commands/register-exercise-command";
import type { GetMusclesByIdsQuery } from "@/_libs/prisma/queries/get-muscles-by-ids-query";
import type { GetTraineeByIdQuery } from "@/_libs/prisma/queries/get-trainee-by-id-query";


type RegisterExerciseResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  getMusclesByIdsQuery: GetMusclesByIdsQuery;
  getTraineeByIdQuery: GetTraineeByIdQuery;
  registerExerciseCommand: RegisterExerciseCommand;
};
export type Props = {
  name: string;
  musclesIds: string[];
  trainee: Trainee;
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
      exercise: {
        id: ulid(),
        name: props.name,
        targets: musclesData,
      },
      trainee: props.trainee,
    });

    return registered;
  };
