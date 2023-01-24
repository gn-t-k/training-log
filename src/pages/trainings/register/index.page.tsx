import {
  ChevronLeftIcon,
  CloseIcon,
  EditIcon,
  HamburgerIcon,
  InfoOutlineIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback } from "react";
import { SubmitHandler, useFieldArray, UseFormReturn } from "react-hook-form";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";
import { RegisterTrainingInput } from "@/libs/trpc/server/routes/training";

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
  const util = trpc.useContext();
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const registerTrainingMutation = trpc.training.register.useMutation({
    onSuccess: () => {
      util.training.invalidate();
      props.goToTrainingsPage();
    },
  });

  const registerTraining: ViewProps["registerTraining"] = (props) => {
    registerTrainingMutation.mutate(props);
  };

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "success":
      return (
        <RegisterTrainingView
          goToTrainingsPage={props.goToTrainingsPage}
          exercises={exercisesQuery.data}
          registerTraining={registerTraining}
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
  registerTraining: (props: RegisterTrainingInput) => void;
};
const RegisterTrainingView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useTrainingFrom();
  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTrainingsPage();
    },
    [props]
  );
  const onSubmit = useCallback<SubmitHandler<TrainingField>>(
    (fieldValues) => {
      const createdAt = ((): Date => {
        const d = new Date(fieldValues.date);
        const [year, month, date] = [getYear(d), getMonth(d), getDate(d)];
        return new Date(year, month, date);
      })();
      const records = fieldValues.records.flatMap((record) => {
        const exercise = props.exercises.find(
          (exercise) => exercise.id === record.exerciseId
        );

        if (exercise === undefined) {
          return [];
        }

        const sets = record.sets.map((set) => ({
          weight: parseInt(set.weight),
          repetition: parseInt(set.repetition),
        }));

        return [
          {
            exercise,
            sets,
            memo: record.memo,
          },
        ];
      });

      props.registerTraining({
        createdAt,
        records,
      });
    },
    [props]
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
          <Stack direction="column" gap={8}>
            <FormControl isInvalid={!!errors.date}>
              <FormLabel htmlFor="date">日付</FormLabel>
              <Input id="date" {...register("date")} type="date" />
              {!!errors.date && (
                <FormErrorMessage>{errors.date.message}</FormErrorMessage>
              )}
            </FormControl>
            <RecordForm
              control={control}
              errors={errors}
              register={register}
              exercises={props.exercises}
            />
            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

type RecordFormProps = {
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  exercises: Exercise[];
};
const RecordForm: FC<RecordFormProps> = (props) => {
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: "records",
  });

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
  const onClickDeleteExercise = useCallback<
    (recordIndex: number) => MouseEventHandler
  >(
    (recordIndex) => (_) => {
      remove(recordIndex);
    },
    [remove]
  );

  return (
    <Stack direction="column">
      <Stack direction="column">
        {fields.map((field, recordIndex) => {
          return (
            <Card key={field.id}>
              <CardHeader>
                <Stack direction="row">
                  <FormControl
                    isInvalid={
                      !!props.errors.records?.[recordIndex]?.exerciseId
                    }
                  >
                    <FormLabel>種目を選択</FormLabel>
                    <Select
                      {...props.register(`records.${recordIndex}.exerciseId`)}
                    >
                      {props.exercises.map((exercise) => {
                        return (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        );
                      })}
                    </Select>
                    {!!props.errors.records?.[recordIndex]?.exerciseId && (
                      <FormErrorMessage>
                        {
                          props.errors.records?.[recordIndex]?.exerciseId
                            ?.message
                        }
                      </FormErrorMessage>
                    )}
                  </FormControl>
                  <Spacer />
                  <Popover>
                    <PopoverTrigger>
                      <Button>
                        <HamburgerIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Stack direction="column">
                          <Stack direction="row" justifyContent="center">
                            <InfoOutlineIcon />
                            <Text>種目の詳細</Text>
                          </Stack>
                          <Stack direction="row" justifyContent="center">
                            <EditIcon />
                            <Text>メモを追加</Text>
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            onClick={onClickDeleteExercise(recordIndex)}
                          >
                            <CloseIcon />
                            <Text>種目を削除</Text>
                          </Stack>
                        </Stack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Stack>
              </CardHeader>
              <CardBody>
                <SetForm
                  control={props.control}
                  errors={props.errors}
                  register={props.register}
                  recordIndex={recordIndex}
                />
              </CardBody>
            </Card>
          );
        })}
      </Stack>
      <Button onClick={onClickAddExercise}>種目から追加</Button>
      <FormControl isInvalid={!!props.errors.records}>
        {!!props.errors.records && (
          <FormErrorMessage>{props.errors.records.message}</FormErrorMessage>
        )}
      </FormControl>
    </Stack>
  );
};

type SetFormProps = {
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  recordIndex: number;
};
const SetForm: FC<SetFormProps> = (props) => {
  const { fields, append, remove } = useFieldArray({
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
  const onClickDeleteSet = useCallback<(setIndex: number) => MouseEventHandler>(
    (setIndex) => (_) => {
      remove(setIndex);
    },
    [remove]
  );

  return (
    <Stack direction="column">
      {fields.map((field, setIndex) => {
        return (
          <Grid key={field.id} templateColumns="2fr 3fr 3fr 1fr" gap={2}>
            <GridItem>
              <Stack direction="column">
                <Text>セット</Text>
                <Text>{setIndex + 1}</Text>
              </Stack>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  !!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                    ?.weight
                }
              >
                <FormLabel>重さ</FormLabel>
                <InputGroup>
                  <Input
                    {...props.register(
                      `records.${props.recordIndex}.sets.${setIndex}.weight`
                    )}
                    type="number"
                  />
                  <InputRightElement>kg</InputRightElement>
                </InputGroup>
                {!!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                  ?.weight && (
                  <FormErrorMessage>
                    {
                      props.errors.records?.[props.recordIndex]?.sets?.[
                        setIndex
                      ]?.weight?.message
                    }
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  !!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                    ?.repetition
                }
              >
                <FormLabel>回数</FormLabel>
                <InputGroup>
                  <Input
                    {...props.register(
                      `records.${props.recordIndex}.sets.${setIndex}.repetition`
                    )}
                    type="number"
                  />
                  <InputRightElement>回</InputRightElement>
                </InputGroup>
                {!!props.errors.records?.[props.recordIndex]?.sets?.[setIndex]
                  ?.repetition && (
                  <FormErrorMessage>
                    {
                      props.errors.records?.[props.recordIndex]?.sets?.[
                        setIndex
                      ]?.repetition?.message
                    }
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <Button onClick={onClickDeleteSet(setIndex)}>
                <SmallCloseIcon />
              </Button>
            </GridItem>
          </Grid>
        );
      })}
      <Button onClick={onClickAddSet}>セットを追加</Button>
      {!!props.errors.records?.[props.recordIndex]?.sets && (
        <FormControl
          isInvalid={!!props.errors.records[props.recordIndex]?.sets}
        >
          <FormErrorMessage>
            {props.errors.records[props.recordIndex]?.sets?.message}
          </FormErrorMessage>
        </FormControl>
      )}
    </Stack>
  );
};
