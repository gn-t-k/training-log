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
  Stack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler } from "react";
import { SubmitHandler } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Exercise } from "@/features/exercise/exercise";
import {
  ExerciseField,
  useExerciseForm,
} from "@/features/exercise/use-exercise-form";
import { useGetExerciseId } from "@/features/exercise/use-get-exercise-id";
import { Muscle } from "@/features/muscle/muscle";

const Exercise: NextPage = () => {
  const id = useGetExerciseId();
  const router = useRouter();

  if (id === null) {
    router.push(pagesPath.exercises.$url());

    // TODO
    return <p>リダイレクト中</p>;
  }

  return <ExerciseContainer {...{ id }} />;
};
export default Exercise;

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
      util.exercise.getAll.invalidate;
      router.push(pagesPath.exercises.$url());
    },
  });
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.getAll.invalidate;
      router.push(pagesPath.exercises.$url());
    },
  });

  const updateExercise: ViewProps["updateExercise"] = (exercise) => {
    updateExerciseMutation.mutate(exercise);
  };
  const deleteExercise: ViewProps["deleteExercise"] = (id) => {
    deleteExerciseMutation.mutate({ id });
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
    />
  );
};

type ViewProps = {
  exercise: Exercise;
  targets: Muscle[];
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
};
const ExerciseView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
  } = useExerciseForm({
    name: props.exercise.name,
    muscleIds: props.exercise.targets.map((t) => t.id),
  });
  console.log({ values: getValues() });

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
  return (
    <Container>
      <Heading>種目を編集</Heading>
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
                {props.targets.map((target) => {
                  // TODO
                  const isChecked =
                    props.exercise.targets.find((t) => t.id === target.id) !==
                    undefined;

                  return (
                    <Checkbox
                      key={target.id}
                      value={target.id}
                      {...register("muscleIds")}
                    >
                      {target.name}
                    </Checkbox>
                  );
                })}
              </Stack>
            </CheckboxGroup>
            {!!errors.muscleIds && (
              <FormErrorMessage>{errors.muscleIds.message}</FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit">変更を保存</Button>
          <Button onClick={onClickDelete}>種目を削除</Button>
        </Stack>
      </form>
    </Container>
  );
};
