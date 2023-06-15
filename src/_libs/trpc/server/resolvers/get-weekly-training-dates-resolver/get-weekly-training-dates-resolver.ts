import type { GetWeeklyTrainingDatesQuery } from "@/_libs/prisma/queries/get-weekly-training-dates-query";

type GetWeeklyTrainingDatesResolver = (
  deps: Deps
) => (props: Props) => Promise<Date[]>;
export type Deps = {
  getWeeklyTrainingDatesQuery: GetWeeklyTrainingDatesQuery;
};
export type Props = {
  start: Date;
  traineeId: string;
};
export const getWeeklyTrainingDatesResolver: GetWeeklyTrainingDatesResolver =
  (deps) => async (props) => {
    const trainingDates = await deps.getWeeklyTrainingDatesQuery({
      start: props.start,
      traineeId: props.traineeId,
    });

    return trainingDates;
  };
