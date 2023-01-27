import { useRouter } from "next/router";
import { z } from "zod";

type UseGetMuscleId = () => string | null;
export const useGetMuscleId: UseGetMuscleId = () => {
  const [_first, second, third, fourth, ..._rest] =
    useRouter().asPath.split("/");
  const validPathsSchema = z.object({
    second: z.literal("settings"),
    third: z.literal("muscles"),
    fourth: z.string().min(1),
  });
  const parseResult = validPathsSchema.safeParse({
    second,
    third,
    fourth,
  });

  return parseResult.success ? parseResult.data.fourth : null;
};
