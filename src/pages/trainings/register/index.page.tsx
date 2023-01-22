import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback } from "react";
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Exercise } from "@/features/exercise/exercise";
import {
  TrainingField,
  useTrainingFrom,
} from "@/features/training/use-training-form";

const RegisterTrainingPage: NextPage = () => {
  const router = useRouter();
  const goToTrainingsPage = useCallback<Props["goToTrainingsPage"]>(() => {
    router.push(pagesPath.trainings.$url());
  }, [router]);

  return (
    <RequireLogin>
      <RegisterTraining goToTrainingsPage={goToTrainingsPage} />
    </RequireLogin>
  );
};
export default RegisterTrainingPage;

type Props = {
  goToTrainingsPage: () => void;
};
const RegisterTraining: FC<Props> = (props) => {
  const exercisesQuery = trpc.exercise.getAll.useQuery();

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "success":
      return (
        <RegisterTrainingView
          goToTrainingsPage={props.goToTrainingsPage}
          exercises={exercisesQuery.data}
        />
      );
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  exercises: Exercise[];
  goToTrainingsPage: () => void;
};
const RegisterTrainingView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useTrainingFrom();
  const { fields, append } = useFieldArray({
    control,
    name: "records",
  });
  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTrainingsPage();
    },
    [props]
  );
  const onSubmit = useCallback<SubmitHandler<TrainingField>>((fieldValues) => {
    const date = ((): Date => {
      const d = new Date(fieldValues.date);
      const [year, month, date] = [getYear(d), getMonth(d), getDate(d)];
      return new Date(year, month, date);
    })();
    console.log({ date });
  }, []);
  const onClickAddExercise = useCallback<MouseEventHandler>(
    (_) => {
      append({
        exerciseId: "",
        memo: "",
        sets: [
          {
            weight: "",
            repetition: "",
          },
        ],
      });
    },
    [append]
  );

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={onClickBack}>
            <ChevronLeftIcon />
          </Button>
          <Heading>トレーニングを記録する</Heading>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.date}>
            <FormLabel htmlFor="date">日付</FormLabel>
            <Input id="date" {...register("date")} type="date" />
            {!!errors.date && (
              <FormErrorMessage>{errors.date.message}</FormErrorMessage>
            )}
          </FormControl>
          <Stack direction="column">
            {fields.map((field, index) => {
              return (
                <Stack direction="column" key={field.id}>
                  <FormControl>
                    <FormLabel>種目を選択</FormLabel>
                    <Select {...register(`records.${index}.exerciseId`)}>
                      {props.exercises.map((exercise) => {
                        return (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Stack direction="column">
                    <SetForm
                      control={control}
                      errors={errors}
                      register={register}
                      recordIndex={index}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
          <Button onClick={onClickAddExercise}>種目から追加</Button>
          <Button type="submit">保存</Button>
        </form>
      </Stack>
    </Container>
  );
};

type SetFormProps = {
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  recordIndex: number;
};
const SetForm: FC<SetFormProps> = (props) => {
  const { fields, append } = useFieldArray({
    control: props.control,
    name: `records.${props.recordIndex}.sets`,
  });
  const onClickAddSet = useCallback<MouseEventHandler>(
    (_) => {
      append({
        weight: "",
        repetition: "",
      });
    },
    [append]
  );

  return (
    <Stack direction="column">
      {fields.map((field, setIndex) => {
        return (
          <Stack key={setIndex} direction="column">
            <FormControl
              isInvalid={
                !!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                  ?.weight
              }
            >
              <FormLabel>重さ</FormLabel>
              <Input
                {...props.register(
                  `records.${props.recordIndex}.sets.${setIndex}.weight`
                )}
                type="number"
              />
            </FormControl>
            <FormControl
              isInvalid={
                !!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                  ?.repetition
              }
            >
              <FormLabel>回数</FormLabel>
              <Input
                {...props.register(
                  `records.${props.recordIndex}.sets.${setIndex}.repetition`
                )}
                type="number"
              />
            </FormControl>
          </Stack>
        );
      })}
      <Button onClick={onClickAddSet}>セットを追加</Button>
    </Stack>
  );
};
