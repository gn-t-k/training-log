import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, ReactElement, useEffect } from "react";
import { SubmitHandler, Controller } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { MutationState } from "@/utils/mutation-state";

import { Exercise } from "@/features/exercise/exercise";
import {
  ExerciseField,
  useExerciseForm,
} from "@/features/exercise/use-exercise-form";
import { useGetExerciseId } from "@/features/exercise/use-get-exercise-id";
import { Muscle } from "@/features/muscle/muscle";

const ExercisePage: NextPage = () => {
  const id = useGetExerciseId();
  const router = useRouter();

  if (id === null) {
    router.push(pagesPath.exercises.$url());

    // TODO
    return <p>リダイレクト中</p>;
  }

  return <ExerciseContainer {...{ id }} />;
};
export default ExercisePage;

type ContainerProps = {
  id: string;
};
const ExerciseContainer: FC<ContainerProps> = (props) => {
  const util = trpc.useContext();
  const router = useRouter();
  const exerciseQuery = trpc.exercise.getById.useQuery({
    id: props.id,
  });
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const updateExerciseMutation = trpc.exercise.update.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      router.push(pagesPath.exercises.$url());
    },
  });
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      router.push(pagesPath.exercises.$url());
    },
  });

  const updateExercise: ViewProps["updateExercise"] = (exercise) => {
    updateExerciseMutation.mutate(exercise);
  };
  const deleteExercise: ViewProps["deleteExercise"] = (id) => {
    deleteExerciseMutation.mutate({ id });
  };
  const goToExercisesPage: ViewProps["goToExercisesPage"] = () => {
    router.push(pagesPath.exercises.$url());
  };

  switch (exerciseQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  return (
    <ExerciseView
      exercise={exerciseQuery.data}
      targets={musclesQuery.data}
      updateExercise={updateExercise}
      deleteExercise={deleteExercise}
      updateExerciseStatus={updateExerciseMutation.status}
      deleteExerciseStatus={deleteExerciseMutation.status}
      goToExercisesPage={goToExercisesPage}
    />
  );
};

type ViewProps = {
  exercise: Exercise;
  targets: Muscle[];
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  updateExerciseStatus: MutationState;
  deleteExerciseStatus: MutationState;
  goToExercisesPage: () => void;
};
export const ExerciseView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useExerciseForm({
    name: props.exercise.name,
    muscleIds: props.exercise.targets.map((t) => t.id),
  });
  const toast = useToast();
  useEffect(() => {
    switch (props.updateExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目の変更を保存しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の変更の保存に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.updateExerciseStatus, toast]);
  useEffect(() => {
    switch (props.deleteExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目を削除しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の削除に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.deleteExerciseStatus, toast]);

  const onSubmit: SubmitHandler<ExerciseField> = (formValue) => {
    const targets = formValue.muscleIds.flatMap((id) => {
      const target = props.targets.find((t) => t.id === id);

      return target ? [target] : [];
    });
    props.updateExercise({
      id: props.exercise.id,
      name: formValue.name,
      targets,
    });
  };
  const onClickDelete: MouseEventHandler = (e) => {
    e.preventDefault();

    props.deleteExercise(props.exercise.id);
  };
  const isLoading =
    props.updateExerciseStatus === "loading" ||
    props.deleteExerciseStatus === "loading";
  const goToExercisesPage: MouseEventHandler = (e) => {
    e.preventDefault();

    props.goToExercisesPage();
  };

  return (
    <Container>
      <Button onClick={goToExercisesPage}>
        <ChevronLeftIcon />
      </Button>
      <Heading>種目を編集</Heading>
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
              render={({ field }): ReactElement => (
                // FIXME: forwardRef使えエラーが出る
                <CheckboxGroup {...field}>
                  <Stack direction="column">
                    {props.targets.map((target) => (
                      <Checkbox key={target.id} value={target.id}>
                        {target.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              )}
            />
            {!!errors.muscleIds && (
              <FormErrorMessage>{errors.muscleIds.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit" isDisabled={isLoading}>
            {isLoading ? <Spinner /> : "変更を保存"}
          </Button>
          <Button onClick={onClickDelete} isDisabled={isLoading}>
            {isLoading ? <Spinner /> : "種目を削除"}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};
