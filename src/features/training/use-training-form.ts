import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { string, z } from "zod";

import { useForm } from "@/libs/react-hook-form/use-form";

import { isValidDate } from "@/utils/date";

const trainingFieldSchema = z.object({
  date: z.string().refine(isValidDate, "日付を入力してください"),
  records: z.array(
    z.object({
      exerciseId: z.string().min(1, "種目を選択してください"),
      memo: z.string().default(""),
      sets: z.array(
        z.object({
          weight: string()
            .min(1, "重量を入力してください")
            .regex(/^[0-9]+$/, "数字で入力してください"),
          repetition: string()
            .min(1, "回数を入力してください")
            .regex(/^[0-9]+$/, "数字で入力してください"),
        })
      ),
    })
  ),
});
export type TrainingField = z.infer<typeof trainingFieldSchema>;

type UseTrainingForm = (
  defaultValues?: TrainingField
) => UseFormReturn<TrainingField>;
export const useTrainingFrom: UseTrainingForm = (defaultValues) => {
  return useForm<TrainingField>({
    resolver: zodResolver(trainingFieldSchema),
    defaultValues: defaultValues ?? {
      date: format(new Date(), "yyyy-MM-dd"),
      records: [
        {
          exerciseId: "",
          memo: "",
          sets: [
            {
              weight: "",
              repetition: "",
            },
          ],
        },
      ],
    },
  });
};
