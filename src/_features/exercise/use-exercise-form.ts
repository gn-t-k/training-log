import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "@/_libs/react-hook-form/use-form";

import type { UseFormReturn } from "react-hook-form";

const exerciseFieldSchema = z.object({
  name: z.string().min(1, "種目名を入力してください"),
  muscleIds: z.array(z.string()).min(1, "部位を選択してください"),
});
export type ExerciseField = z.infer<typeof exerciseFieldSchema>;

type UseExerciseForm = (
  defaultValues?: ExerciseField
) => UseFormReturn<ExerciseField>;
export const useExerciseForm: UseExerciseForm = (defaultValues) => {
  return useForm<ExerciseField>({
    resolver: zodResolver(exerciseFieldSchema),
    defaultValues: defaultValues ?? {
      name: "",
      muscleIds: [],
    },
  });
};
