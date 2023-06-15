import type { GetWeeklyNumberOfSetsByMuscleIdQuery } from "@/_libs/prisma/queries/get-weekly-number-of-sets-by-muscle-id-query";

type GetWeeklyNumberOfSetsByMuscleIdResolver = (
  deps: Deps
) => (props: Props) => Promise<number>;
export type Deps = {
  getWeeklyNumberOfSetsByMuscleIdQuery: GetWeeklyNumberOfSetsByMuscleIdQuery;
};
export type Props = {
  muscleId: string;
  start: Date;
  traineeId: string;
};
export const getWeeklyNumberOfSetsByMuscleIdResolver: GetWeeklyNumberOfSetsByMuscleIdResolver =
  (deps) => async (props) => {
    const weeklyNumberOfSets = await deps.getWeeklyNumberOfSetsByMuscleIdQuery({
      muscleId: props.muscleId,
      start: props.start,
      traineeId: props.traineeId,
    });

    return weeklyNumberOfSets;
  };
