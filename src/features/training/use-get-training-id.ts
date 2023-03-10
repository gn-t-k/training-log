import { useRouter } from "next/router";
import { z } from "zod";

type UseGetTrainingId = () => string | null;
export const useGetTrainingId: UseGetTrainingId = () => {
  const [_first, second, third, ..._rest] = useRouter().asPath.split("/");
  const validPathsSchema = z.object({
    second: z.literal("trainings"),
    third: z.string().min(1),
  });
  const parseResult = validPathsSchema.safeParse({
    second,
    third,
  });

  return parseResult.success ? parseResult.data.third : null;
};
