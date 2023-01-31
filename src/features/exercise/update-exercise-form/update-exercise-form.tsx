import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect } from "react";
import { Controller } from "react-hook-form";

import { trpc } from "@/libs/trpc/client/trpc";

import type { MutationState } from "@/utils/mutation-state";

import { useExerciseForm } from "../use-exercise-form";

import type { Exercise } from "../exercise";
import type { ExerciseField } from "../use-exercise-form";
import type { Muscle } from "@/features/muscle/muscle";
import type { FC, ReactElement } from "react";
import type { SubmitHandler } from "react-hook-form";

type Props = {
  exercise: Exercise;
};
export const UpdateExerciseForm: FC<Props> = (props) => {
  const util = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const updateExerciseMutation = trpc.exercise.update.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
    },
  });
  const exercisesQuery = trpc.exercise.getAll.useQuery();

  const updateExercise = useCallback<ViewProps["updateExercise"]>(
    (props) => {
      updateExerciseMutation.mutate(props);
    },
    [updateExerciseMutation]
  );

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <UpdateExerciseFormView
      updateExercise={updateExercise}
      updateExerciseStatus={updateExerciseMutation.status}
      targets={musclesQuery.data}
      currentExercise={props.exercise}
      registeredExercises={exercisesQuery.data}
    />
  );
};

type ViewProps = {
  updateExercise: (props: { before: Exercise; after: Exercise }) => void;
  updateExerciseStatus: MutationState;
  targets: Muscle[];
  currentExercise: Exercise;
  registeredExercises: Exercise[];
};
export const UpdateExerciseFormView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useExerciseForm({
    name: props.currentExercise.name,
    muscleIds: props.currentExercise.targets.map((t) => t.id),
  });
  const toast = useToast();

  const isLoading = props.updateExerciseStatus === "loading";

  const onSubmit = useCallback<SubmitHandler<ExerciseField>>(
    (fieldValues) => {
      const isSameNameExerciseExist = props.registeredExercises.some(
        (exercise) => exercise.name === fieldValues.name
      );
      if (isSameNameExerciseExist) {
        setError("name", {
          type: "custom",
          message: `種目「${fieldValues.name}」はすでに登録されています`,
        });
        return;
      }

      const targets = fieldValues.muscleIds.flatMap((id) => {
        const target = props.targets.find((t) => t.id === id);

        return target ? [target] : [];
      });
      props.updateExercise({
        before: props.currentExercise,
        after: {
          id: props.currentExercise.id,
          name: fieldValues.name,
          targets,
        },
      });
    },
    [props, setError]
  );

  useEffect(() => {
    switch (props.updateExerciseStatus) {
      case "success":
        toast({
          title: "種目の変更を保存しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "種目の変更の保存に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [props.updateExerciseStatus, toast]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column">
        <FormControl isInvalid={!!errors.name} isDisabled={isLoading}>
          <FormLabel>種目の名前</FormLabel>
          <Input {...register("name")} />
          {!!errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.muscleIds} isDisabled={isLoading}>
          <FormLabel>この種目で鍛えられる部位</FormLabel>
          <Controller
            control={control}
            name="muscleIds"
            render={({
              field: {
                ref: _, // MEMO: forwardRef使えエラーが出るため捨てている
                ...attr
              },
            }): ReactElement => {
              return (
                <CheckboxGroup {...attr}>
                  <Stack direction="column">
                    {props.targets.map((target) => (
                      <Checkbox key={target.id} value={target.id}>
                        {target.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              );
            }}
          />
          {!!errors.muscleIds && (
            <FormErrorMessage>{errors.muscleIds.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button type="submit" isDisabled={isLoading}>
          {isLoading ? <Spinner /> : "変更を保存"}
        </Button>
      </Stack>
    </form>
  );
};
