import { TRPCError } from "@trpc/server";

import type { GetLatestSetQuery } from "@/libs/prisma/queries/get-latest-set-query";

import type { Set } from "@/features/training/training";

type GetLatestSetResolver = (
  deps: Deps
) => (props: Props) => Promise<Set | null>;
export type Deps = {
  getLatestSetQuery: GetLatestSetQuery;
};
export type Props = {
  exerciseId: string;
  traineeId: string;
};
export const getLatestSetResolver: GetLatestSetResolver =
  (deps) => async (props) => {
    const latestSet = await deps.getLatestSetQuery({
      exerciseId: props.exerciseId,
    });

    if (latestSet === null) {
      return null;
    }

    if (latestSet.traineeId !== props.traineeId) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return latestSet.set;
  };
