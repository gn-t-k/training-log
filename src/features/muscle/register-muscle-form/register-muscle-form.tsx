import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

import { trpc } from "@/libs/trpc/client/trpc";

import { Muscle } from "../muscle";
import { useMuscleForm, MuscleField } from "../use-muscle-form";

export const RegisterMuscleForm: FC = () => {
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
  const isRegisterMuscleLoading = registerMuscleMutator.isLoading;
  const isRegisterMuscleError = registerMuscleMutator.isError;

  return (
    <RegisterMuscleFormView
      {...{
        muscles,
        registerMuscle,
        isRegisterMuscleLoading,
        isRegisterMuscleError,
      }}
    />
  );
};

type Props = {
  muscles: Muscle[];
  registerMuscle: (name: string) => void;
  isRegisterMuscleLoading: boolean;
  isRegisterMuscleError: boolean;
};
export const RegisterMuscleFormView: FC<Props> = ({
  muscles,
  registerMuscle,
  isRegisterMuscleLoading,
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
    formState: { errors },
  } = useMuscleForm();

  const onSubmit: SubmitHandler<MuscleField> = (formValue) => {
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
      <Button type="submit" isDisabled={isRegisterMuscleLoading}>
        {isRegisterMuscleLoading ? <Spinner /> : "登録する"}
      </Button>
    </form>
  );
};
