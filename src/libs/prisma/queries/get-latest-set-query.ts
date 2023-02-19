import { decodeTime } from "ulid";

import prisma from "../client";

import type { Set } from "@/features/training/training";

export type GetLatestSetQuery = (props: {
  exerciseId: string;
}) => Promise<{ traineeId: string; set: Set } | null>;
export const getLatestSetQuery: GetLatestSetQuery = async (props) => {
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
        select: {
          id: true,
          sets: true,
        },
      },
    },
  });

  if (data === null) {
    return null;
  }

  const sets = data.records.flatMap((record) => record.sets);

  const latestSet = sets.sort(
    (left, right) => decodeTime(right.id) - decodeTime(left.id)
  )[0];

  return latestSet === undefined
    ? null
    : {
        traineeId: data.traineeId,
        set: latestSet,
      };
};
