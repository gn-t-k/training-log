import { TRPCError } from "@trpc/server";

import { GetTrainingByIdQuery } from "@/libs/prisma/queries/get-training-by-id-query";

import { Trainee } from "@/features/trainee/trainee";
import { Training } from "@/features/training/training";

type GetTrainingByIdResolver = (
  deps: Deps
) => (props: Props) => Promise<Training>;
export type Deps = {
  getTrainingByIdQuery: GetTrainingByIdQuery;
};
export type Props = {
  id: string;
  trainee: Trainee;
};
export const getTrainingByIdResolver: GetTrainingByIdResolver =
  (deps) => async (props) => {
    const training = await deps.getTrainingByIdQuery({
      id: props.id,
    });

    const isOwnMuscle =
      training !== null && training.traineeId === props.trainee.id;
    if (!isOwnMuscle) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return training;
  };
