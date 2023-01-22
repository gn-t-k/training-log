import { useRouter } from "next/router";
import { z } from "zod";

type UseGetMuscleId = () => string | null;
export const useGetMuscleId: UseGetMuscleId = () => {
  const [_first, second, third, ..._rest] = useRouter().asPath.split("/");
  const validPathsSchema = z.object({
    second: z.literal("muscles"),
    third: z.string().min(1),
  });
  const parseResult = validPathsSchema.safeParse({
    second,
    third,
  });

  return parseResult.success ? parseResult.data.third : null;
};
