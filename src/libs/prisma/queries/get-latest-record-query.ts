import { decodeTime } from "ulid";

import prisma from "../client";

import type { Record } from "@/features/training/training";

export type GetLatestRecordQuery = (props: {
  exerciseId: string;
}) => Promise<{ traineeId: string; record: Record } | null>;
export const getLatestRecordQuery: GetLatestRecordQuery = async (props) => {
  const data = await prisma.training.findFirst({
    where: {
      records: {
        some: {
          exerciseId: props.exerciseId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      traineeId: true,
      records: {
        where: {
          exerciseId: props.exerciseId,
        },
        include: {
          exercise: {
            include: {
              targets: true,
            },
          },
          sets: true,
        },
      },
    },
  });

  if (data === null) {
    return null;
  }

  const latestRecord = data.records.sort(
    (left, right) => decodeTime(right.id) - decodeTime(left.id)
  )[0];

  return latestRecord === undefined
    ? null
    : {
        traineeId: data.traineeId,
        record: latestRecord,
      };
};
