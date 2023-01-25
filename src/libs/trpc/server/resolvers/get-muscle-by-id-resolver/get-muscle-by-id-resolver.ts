import { TRPCError } from "@trpc/server";

import type { GetMuscleByIdQuery } from "@/libs/prisma/queries/get-muscle-by-id-query";

import type { Muscle } from "@/features/muscle/muscle";
import type { Trainee } from "@/features/trainee/trainee";

type GetMuscleByIdResolver = (deps: Deps) => (props: Props) => Promise<Muscle>;
export type Deps = {
  getMuscleByIdQuery: GetMuscleByIdQuery;
};
export type Props = {
  id: string;
  trainee: Trainee;
};
export const getMuscleByIdResolver: GetMuscleByIdResolver =
  (deps) => async (props) => {
    const muscle = await deps.getMuscleByIdQuery({
      id: props.id,
    });

    const isOwnMuscle =
      muscle !== null && muscle.traineeId === props.trainee.id;
    if (!isOwnMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return muscle;
  };
