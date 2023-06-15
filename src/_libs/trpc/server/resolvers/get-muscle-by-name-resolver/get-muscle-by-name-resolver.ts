import { TRPCError } from "@trpc/server";

import type { Muscle } from "@/_features/muscle/muscle";
import type { GetMuscleByNameQuery } from "@/_libs/prisma/queries/get-muscle-by-name-query";


type GetMuscleByNameResolver = (
  deps: Deps
) => (props: Props) => Promise<Muscle>;
export type Deps = {
  getMuscleByNameQuery: GetMuscleByNameQuery;
};
export type Props = {
  name: string;
  traineeId: string;
};
export const getMuscleByNameResolver: GetMuscleByNameResolver =
  (deps) => async (props) => {
    const muscleData = await deps.getMuscleByNameQuery({
      name: props.name,
      traineeId: props.traineeId,
    });

    if (muscleData === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return muscleData;
  };
