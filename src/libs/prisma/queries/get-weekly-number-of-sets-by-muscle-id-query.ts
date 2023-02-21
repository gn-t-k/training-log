import { addDays } from "date-fns";

import prisma from "../client";

export type GetWeeklyNumberOfSetsByMuscleIdQuery = (props: {
  traineeId: string;
  muscleId: string;
  start: Date;
}) => Promise<number>;
export const getWeeklyNumberOfSetsByMuscleIdQuery: GetWeeklyNumberOfSetsByMuscleIdQuery =
  async (props) => {
    const end = addDays(props.start, 6);
    const data = await prisma.training.findMany({
      where: {
        traineeId: props.traineeId,
        createdAt: {
          gte: props.start,
          lte: end,
        },
        records: {
          some: {
            exercise: {
              targets: {
                some: {
                  id: props.muscleId,
                },
              },
            },
          },
        },
      },
      select: {
        records: {
          select: {
            exercise: {
              select: {
                targets: true,
              },
            },
            sets: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    const records = data.flatMap((datum) => datum.records);
    const targetRecords = records.filter((record) =>
      record.exercise.targets.some((target) => target.id === props.muscleId)
    );

    return targetRecords.flatMap((record) => record.sets).length;
  };
