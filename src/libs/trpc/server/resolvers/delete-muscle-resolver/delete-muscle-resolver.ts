import { TRPCError } from "@trpc/server";

import { DeleteMuscleCommand } from "@/libs/prisma/commands/delete-muscle-command";
import { GetMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";

type DeleteMuscleResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  getMuscleByIdQuery: GetMuscleByIdQuery;
  deleteMuscleCommand: DeleteMuscleCommand;
};
export type Props = {
  id: string;
  traineeId: string;
};
export const deleteMuscleResolver: DeleteMuscleResolver =
  (deps) => async (props) => {
    const muscleData = await deps.getMuscleByIdQuery({ id: props.id });

    const isOwnMuscle =
      muscleData !== null && muscleData.traineeId === props.traineeId;

    if (muscleData === null || !isOwnMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    await deps.deleteMuscleCommand({ muscle: muscleData });
  };
