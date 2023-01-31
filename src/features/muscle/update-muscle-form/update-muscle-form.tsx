import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import type { MutationState } from "@/utils/mutation-state";

import { useMuscleForm } from "@/features/muscle/use-muscle-form";

import type { Muscle } from "@/features/muscle/muscle";
import type { MuscleField } from "@/features/muscle/use-muscle-form";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

type Props = {
  muscle: Muscle;
};

export const UpdateMuscleForm: FC<Props> = (props) => {
  const util = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const updateMuscleNameMutation = trpc.muscle.updateName.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
    },
  });
  const updateMuscle = useCallback<ViewProps["updateMuscle"]>(
    (muscle) => {
      updateMuscleNameMutation.mutate({
        id: props.muscle.id,
        name: muscle.name,
      });
    },
    [props.muscle.id, updateMuscleNameMutation]
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
    <UpdateMuscleFormView
      muscle={props.muscle}
      updateMuscle={updateMuscle}
      updateMuscleStatus={updateMuscleNameMutation.status}
      registeredMuscles={musclesQuery.data}
    />
  );
};

type ViewProps = {
  muscle: Muscle;
  updateMuscle: (props: Muscle) => void;
  updateMuscleStatus: MutationState;
  registeredMuscles: Muscle[];
};
export const UpdateMuscleFormView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useMuscleForm({
    name: props.muscle.name,
  });
  const toast = useToast();

  useEffect(() => {
    switch (props.updateMuscleStatus) {
      case "success":
        toast({
          title: "部位の変更を保存しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の変更の保存に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.updateMuscleStatus, toast]);

  const onSubmit = useCallback<SubmitHandler<MuscleField>>(
    (fieldValues) => {
      const isSameNameMuscleExist = props.registeredMuscles.some(
        (muscle) => muscle.name === fieldValues.name
      );

      if (fieldValues.name !== props.muscle.name && isSameNameMuscleExist) {
        setError("name", {
          type: "custom",
          message: `部位「${fieldValues.name}」はすでに登録されています`,
        });
        return;
      }

      props.updateMuscle({
        id: props.muscle.id,
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
          <Input {...register("name")} id="name" />
          {!!errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          isLoading={props.updateMuscleStatus === "loading"}
          isDisabled={props.updateMuscleStatus === "loading"}
        >
          変更を保存
        </Button>
      </Stack>
    </form>
  );
};
