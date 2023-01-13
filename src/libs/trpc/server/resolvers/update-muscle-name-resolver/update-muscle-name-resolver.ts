import { TRPCError } from "@trpc/server";

import { UpdateMuscleNameCommand } from "@/libs/prisma/commands/update-muscle-name-command";
import { GetMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";

import { Muscle } from "@/features/muscle/muscle";

type UpdateMuscleNameResolver = (
  deps: Deps
) => (props: Props) => Promise<Muscle>;
export type Deps = {
  getMuscleByIdQuery: GetMuscleByIdQuery;
  updateMuscleNameCommand: UpdateMuscleNameCommand;
};
export type Props = {
  id: string;
  name: string;
  traineeId: string;
};
export const updateMuscleNameResolver: UpdateMuscleNameResolver =
  (deps) => async (props) => {
    const muscle = await deps.getMuscleByIdQuery({ id: props.id });

    const otherTraineesMuscle =
      muscle !== null && muscle.traineeId !== props.traineeId;

    if (muscle === null || otherTraineesMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    const updated = await deps.updateMuscleNameCommand({
      id: props.id,
      name: props.name,
    });

    return updated;
  };
