import type { GetMonthlyTrainingDatesQuery } from "@/_libs/prisma/queries/get-monthly-training-dates-query";
import type { Month, Year } from "@/_utils/date";

type GetMonthlyTrainingDatesResolver = (
  deps: Deps
) => (props: Props) => Promise<Date[]>;
export type Deps = {
  getMonthlyTrainingDatesQuery: GetMonthlyTrainingDatesQuery;
};
export type Props = {
  year: Year;
  month: Month;
  traineeId: string;
};
export const getMonthlyTrainingDatesResolver: GetMonthlyTrainingDatesResolver =
  (deps) => async (props) => {
    const trainingDates = await deps.getMonthlyTrainingDatesQuery({
      year: props.year,
      month: props.month,
      traineeId: props.traineeId,
    });

    return trainingDates;
  };
