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
import { FC, useEffect } from "react";
import { SubmitHandler } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { MutationState } from "@/utils/mutation-state";

import { Muscle } from "@/features/muscle/muscle";

import { Exercise } from "../exercise";
import { ExerciseField, useExerciseForm } from "../use-exercise-form";

export const RegisterExerciseForm: FC = () => {
  const util = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const registeredExercises = util.exercise.getAll.getData() ?? [];
  const registerExerciseMutation = trpc.exercise.register.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      router.push(pagesPath.exercises.$url());
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
      // TODO
      return <p>部位データを取得中</p>;
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
    formState: { errors, isValid },
    setError,
  } = useExerciseForm();
  const toast = useToast();

  useEffect(() => {
    switch (props.registerExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目を登録しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の登録に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.registerExerciseStatus, toast]);

  const isProcessing = props.registerExerciseStatus === "loading";

  const onSubmit: SubmitHandler<ExerciseField> = (formValue) => {
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
  };

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
          isDisabled={isProcessing || !isValid}
        >
          種目を登録
        </Button>
      </Stack>
    </form>
  );
};
