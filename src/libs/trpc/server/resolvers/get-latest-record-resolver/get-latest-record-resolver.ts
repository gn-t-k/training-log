import { TRPCError } from "@trpc/server";

import type { GetLatestRecordQuery } from "@/libs/prisma/queries/get-latest-record-query";

import type { Record } from "@/features/training/training";

type GetLatestRecordResolver = (
  deps: Deps
) => (props: Props) => Promise<Record | null>;
export type Deps = {
  getLatestRecordQuery: GetLatestRecordQuery;
};
export type Props = {
  exerciseId: string;
  traineeId: string;
};
export const getLatestRecordResolver: GetLatestRecordResolver =
  (deps) => async (props) => {
    const latestRecord = await deps.getLatestRecordQuery({
      exerciseId: props.exerciseId,
    });

    if (latestRecord === null) {
      return null;
    }

    if (latestRecord.traineeId !== props.traineeId) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return latestRecord.record;
  };
