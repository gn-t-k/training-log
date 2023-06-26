import { TRPCError } from "@trpc/server";
import { ulid } from "ulid";

import type { UpdateTrainingCommand } from "@/libs/prisma/commands/update-training-command";
import type { GetTrainingByIdQuery } from "@/libs/prisma/queries/get-training-by-id-query";

import type { Exercise } from "@/features/exercise/exercise";

type UpdateTrainingResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  updateTrainingCommand: UpdateTrainingCommand;
  getTrainingByIdQuery: GetTrainingByIdQuery;
};
export type Props = {
  traineeId: string;
  trainingId: string;
  records: {
    exercise: Exercise;
    sets: {
      weight: number;
      repetition: number;
    }[];
    memo: string;
  }[];
};
export const updateTrainingResolver: UpdateTrainingResolver =
  (deps) => async (props) => {
    const trainingData = await deps.getTrainingByIdQuery({
      id: props.trainingId,
    });
    const isOwnTraining =
      trainingData !== null && trainingData.traineeId === props.traineeId;

    if (trainingData === null || !isOwnTraining) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    await deps.updateTrainingCommand({
      training: {
        before: trainingData,
        after: {
          id: trainingData.id,
          createdAt: trainingData.createdAt,
          records: props.records.map((record) => ({
            id: ulid(),
            exercise: record.exercise,
            sets: record.sets.map((set) => ({
              id: ulid(),
              weight: set.weight,
              repetition: set.repetition,
            })),
            memo: record.memo,
          })),
        },
      },
      updatedAt: new Date(),
    });
  };
