import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "@/libs/react-hook-form/use-form";

import type { UseFormReturn } from "react-hook-form";

const registerFieldSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z
    .string()
    .email("メールアドレスの形式で入力してください")
    .min(1, "メールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});
export type RegisterField = z.infer<typeof registerFieldSchema>;

type UseRegisterForm = (
  defaultValues?: RegisterField
) => UseFormReturn<RegisterField>;
export const useRegisterForm: UseRegisterForm = (defaultValues) => {
  return useForm<RegisterField>({
    resolver: zodResolver(registerFieldSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      password: "",
    },
  });
};
