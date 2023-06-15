import type { Training } from "@/_features/training/training";
import type { GetTrainingsByDateQuery } from "@/_libs/prisma/queries/get-trainings-by-date-query";


type GetTrainingsByDateResolver = (
  deps: Deps
) => (props: Props) => Promise<Training[]>;
export type Deps = {
  getTrainingsByDateQuery: GetTrainingsByDateQuery;
};
export type Props = {
  date: Date;
  traineeId: string;
};
export const getTrainingsByDateResolver: GetTrainingsByDateResolver =
  (deps) => async (props) => {
    const trainings = await deps.getTrainingsByDateQuery({
      traineeId: props.traineeId,
      date: props.date,
    });

    return trainings;
  };
