import { TRPCError } from "@trpc/server";
import { endOfMonth, startOfMonth } from "date-fns";

import type { GetMonthlyTrainingsQuery } from "@/libs/prisma/queries/get-monthly-trainings-query";

import { monthSchema, yearSchema } from "@/utils/date";

import type { Training } from "@/features/training/training";

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
    const date = new Date(year, month);
    const [start, end] = [startOfMonth(date), endOfMonth(date)];
    const trainingsData = await deps.getMonthlyTrainingsQuery({
      start,
      end,
      traineeId: props.traineeId,
    });

    return trainingsData;
  };
