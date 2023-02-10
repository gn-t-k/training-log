import { useRouter } from "next/router";
import { z } from "zod";

import { isValidDate } from "@/utils/date";

type UseGetTrainingDate = () => Date | null;
export const useGetTrainingDate: UseGetTrainingDate = () => {
  const [_first, second, third, fourth, ..._rest] =
    useRouter().asPath.split("/");
  const validPathSchema = z.object({
    second: z.literal("trainings"),
    third: z.literal("dates"),
    fourth: z.string().refine(isValidDate),
  });
  const parseResult = validPathSchema.safeParse({
    second,
    third,
    fourth,
  });

  return parseResult.success ? new Date(parseResult.data.fourth) : null;
};
