import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import { useExerciseForm } from "../use-exercise-form";

import type { Exercise } from "../exercise";
import type { ExerciseField } from "../use-exercise-form";
import type { Muscle } from "@/_features/muscle/muscle";
import type { MutationState } from "@/_utils/mutation-state";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

export const RegisterExerciseForm: FC = () => {
  const util = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const registeredExercises = util.exercise.getAll.getData() ?? [];
  const registerExerciseMutation = trpc.exercise.register.useMutation({
    onSuccess: async () => {
      await util.exercise.invalidate();
      // router.push(pagesPath.settings.exercises.$url());
      await router.push(pagesPath.$url());
    },
  });
  const router = useRouter();

  const registerExercise: ViewProps["registerExercise"] = (props) => {
    registerExerciseMutation.mutate({
      name: props.name,
      targets: props.targets,
    });
  };

  switch (musclesQuery.status) {
    case "loading":
      return <Loading description="部位データを取得しています" />;
    case "success":
      return (
        <RegisterExerciseFormView
          targets={musclesQuery.data}
          registeredExercises={registeredExercises}
          registerExercise={registerExercise}
          registerExerciseStatus={registerExerciseMutation.status}
        />
      );
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  targets: Muscle[];
  registeredExercises: Exercise[];
  registerExercise: (props: { name: string; targets: Muscle[] }) => void;
  registerExerciseStatus: MutationState;
};
export const RegisterExerciseFormView: FC<ViewProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useExerciseForm();
  const toast = useToast();

  useEffect(() => {
    switch (props.registerExerciseStatus) {
      case "success":
        toast({
          title: "種目を登録しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "種目の登録に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [props.registerExerciseStatus, toast]);

  const onSubmit = useCallback<SubmitHandler<ExerciseField>>(
    (formValue) => {
      const isSameNameExerciseExist = props.registeredExercises.some(
        (exercise) => exercise.name === formValue.name
      );
      if (isSameNameExerciseExist) {
        setError("name", {
          type: "custom",
          message: `種目「${formValue.name}」はすでに登録されています`,
        });
        return;
      }

      const targets: Muscle[] = formValue.muscleIds.flatMap((id) => {
        const muscle = props.targets.find((m) => m.id === id);

        return muscle ? [muscle] : [];
      });

      props.registerExercise({
        name: formValue.name,
        targets,
      });
    },
    [props, setError]
  );

  const isProcessing = props.registerExerciseStatus === "loading";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>種目の名前</FormLabel>
          <Input {...register("name")} />
          {!!errors.name && (
            <FormErrorMessage>{errors.name.message}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isInvalid={!!errors.muscleIds}>
          <FormLabel>この種目で鍛えられる部位</FormLabel>
          <CheckboxGroup>
            <Stack direction="column">
              {props.targets.map((muscle) => (
                <Checkbox
                  key={muscle.id}
                  value={muscle.id}
                  {...register("muscleIds")}
                >
                  {muscle.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
          {!!errors.muscleIds && (
            <FormErrorMessage>{errors.muscleIds.message}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          type="submit"
          isLoading={isProcessing}
          isDisabled={isProcessing}
        >
          種目を登録
        </Button>
      </Stack>
    </form>
  );
};
