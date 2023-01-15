import { TRPCError } from "@trpc/server";

import { GetMonthlyTrainingsQuery } from "@/libs/prisma/queries/get-monthly-trainings-query";

import { monthSchema, yearSchema } from "@/utils/date";

import { Training } from "@/features/training/training";

type GetMonthlyTrainingsResolver = (
  deps: Deps
) => (props: Props) => Promise<Training[]>;
export type Deps = {
  getMonthlyTrainingsQuery: GetMonthlyTrainingsQuery;
};
export type Props = {
  year: number;
  month: number;
  traineeId: string;
};
export const getMonthlyTrainingsResolver: GetMonthlyTrainingsResolver =
  (deps) => async (props) => {
    const maybeYear = yearSchema.safeParse(props.year);
    const maybeMonth = monthSchema.safeParse(props.month);

    if (!maybeMonth.success || !maybeYear.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const year = maybeYear.data;
    const month = maybeMonth.data;
    const trainingsData = await deps.getMonthlyTrainingsQuery({
      year,
      month,
      traineeId: props.traineeId,
    });

    return trainingsData.map((training) => ({
      id: training.id,
      createdAt: training.createdAt,
      exercises: training.exercises.map((exercise) => ({
        exercise: exercise.exercise,
        sets: exercise.sets.map((set) => ({
          weight: set.weight,
          repetition: set.repetition,
        })),
      })),
    }));
  };
