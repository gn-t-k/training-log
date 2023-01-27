import { TRPCError } from "@trpc/server";

import type { DeleteTrainingCommand } from "@/libs/prisma/commands/delete-training-command";
import type { GetTrainingByIdQuery } from "@/libs/prisma/queries/get-training-by-id-query";

type DeleteTrainingResolver = (deps: Deps) => (props: Props) => Promise<void>;
export type Deps = {
  deleteTrainingCommand: DeleteTrainingCommand;
  getTrainingByIdQuery: GetTrainingByIdQuery;
};
export type Props = {
  trainingId: string;
  traineeId: string;
};
export const deleteTrainingResolver: DeleteTrainingResolver =
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

    await deps.deleteTrainingCommand({
      training: trainingData,
    });
  };
