import { useRouter } from "next/router";
import { z } from "zod";

type UseGetExerciseId = () => string | null;
export const useGetExerciseId: UseGetExerciseId = () => {
  const [_first, second, third, ..._rest] = useRouter().asPath.split("/");
  const validPathsSchema = z.object({
    second: z.literal("exercises"),
    third: z.string().min(1),
  });
  const parseResult = validPathsSchema.safeParse({
    second,
    third,
  });

  return parseResult.success ? parseResult.data.third : null;
};
