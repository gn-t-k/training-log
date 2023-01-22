import { TRPCError } from "@trpc/server";

import { UpdateMuscleNameCommand } from "@/libs/prisma/commands/update-muscle-name-command";
import { GetMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";

import { Trainee } from "@/features/trainee/trainee";

type UpdateMuscleNameResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  getMuscleByIdQuery: GetMuscleByIdQuery;
  updateMuscleNameCommand: UpdateMuscleNameCommand;
};
export type Props = {
  id: string;
  name: string;
  trainee: Trainee;
};
export const updateMuscleNameResolver: UpdateMuscleNameResolver =
  (deps) => async (props) => {
    const muscleData = await deps.getMuscleByIdQuery({ id: props.id });

    const isOwnMuscle =
      muscleData !== null && muscleData.traineeId === props.trainee.id;
    if (!isOwnMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    await deps.updateMuscleNameCommand({
      muscle: {
        id: props.id,
        name: props.name,
      },
    });
  };
