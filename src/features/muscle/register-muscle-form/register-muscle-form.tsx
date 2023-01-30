import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { MutationState } from "@/utils/mutation-state";

import { useMuscleForm } from "@/features/muscle/use-muscle-form";

import type { Muscle } from "@/features/muscle/muscle";
import type { MuscleField } from "@/features/muscle/use-muscle-form";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

export const RegisterMuscleForm: FC = () => {
  const router = useRouter();
  const util = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const registerMuscleMutation = trpc.muscle.register.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      router.push(pagesPath.settings.muscles.$url());
    },
  });
  const registerMuscle = useCallback<ViewProps["registerMuscle"]>(
    (muscle) => {
      registerMuscleMutation.mutate({
        name: muscle.name,
      });
    },
    [registerMuscleMutation]
  );

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  return (
    <RegisterMuscleFormView
      registerMuscle={registerMuscle}
      registerMuscleStatus={registerMuscleMutation.status}
      registeredMuscles={musclesQuery.data}
    />
  );
};

type ViewProps = {
  registerMuscle: (muscle: { name: string }) => void;
  registerMuscleStatus: MutationState;
  registeredMuscles: Muscle[];
};
export const RegisterMuscleFormView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useMuscleForm();
  const toast = useToast();

  useEffect(() => {
    switch (props.registerMuscleStatus) {
      case "success":
        toast({
          title: "部位を登録しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の登録に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.registerMuscleStatus, toast]);

  const onSubmit = useCallback<SubmitHandler<MuscleField>>(
    (fieldValues) => {
      const isSameNameMuscleExist = props.registeredMuscles.some(
        (muscle) => muscle.name === fieldValues.name
      );

      if (isSameNameMuscleExist) {
        setError("name", {
          type: "custom",
          message: `部位「${fieldValues.name}」はすでに登録されています`,
        });
        return;
      }

      props.registerMuscle({
        name: fieldValues.name,
      });
    },
    [props, setError]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">部位の名前</FormLabel>
          <Input id="name" {...register("name")} />
          {!!errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          isLoading={props.registerMuscleStatus === "loading"}
          isDisabled={props.registerMuscleStatus === "loading"}
        >
          登録する
        </Button>
      </Stack>
    </form>
  );
};
