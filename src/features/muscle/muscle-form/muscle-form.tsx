import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { useForm } from "@/libs/react-hook-form/use-form";
import { trpc } from "@/libs/trpc/client/trpc";

import { Muscle } from "../muscle";

const muscleFieldSchema = z.object({
  name: z.string().min(1, "部位名を入力してください"),
});
type MuscleField = z.infer<typeof muscleFieldSchema>;

export const MuscleForm: FC = () => {
  const util = trpc.useContext();
  const registerMuscleMutator = trpc.muscle.register.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
    },
  });

  const muscles = util.muscle.getAll.getData() ?? [];
  const registerMuscle = (name: string): void => {
    registerMuscleMutator.mutate({ name });
  };
  const isRegisterMuscleError = registerMuscleMutator.isError;

  return (
    <MuscleFormView {...{ muscles, registerMuscle, isRegisterMuscleError }} />
  );
};

type Props = {
  muscles: Muscle[];
  registerMuscle: (name: string) => void;
  isRegisterMuscleError: boolean;
};
export const MuscleFormView: FC<Props> = ({
  muscles,
  registerMuscle,
  isRegisterMuscleError,
}) => {
  const toast = useToast();
  useEffect(() => {
    if (isRegisterMuscleError) {
      toast({
        title: "部位の登録に失敗しました",
        status: "error",
      });
    }
  }, [isRegisterMuscleError, toast]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MuscleField>({
    resolver: zodResolver(muscleFieldSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<MuscleField> = (formValue) => {
    if (muscles === undefined) {
      setError("name", {
        type: "custom",
        message: "部位の登録に失敗しました",
      });
      return;
    }

    const isSameNameMuscleExist = muscles.some(
      (muscle) => muscle.name === formValue.name
    );
    if (isSameNameMuscleExist) {
      setError("name", {
        type: "custom",
        message: `部位${formValue.name}はすでに登録されています`,
      });
      return;
    }

    registerMuscle(formValue.name);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>部位の名前</FormLabel>
        <Input {...register("name")} />
        {!!errors.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <Button type="submit" isDisabled={isSubmitting}>
        登録する
      </Button>
    </form>
  );
};
