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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback, useState } from "react";
import {
  SubmitHandler,
  useFieldArray,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";

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

  const registerTraining = useCallback<ViewProps["registerTraining"]>(
    (props) => {
      registerTrainingMutation.mutate(props);
    },
    [registerTrainingMutation]
  );

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
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "records",
  });

  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTrainingsPage();
    },
    [props]
  );
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
            <Stack direction="column">
              <Stack direction="column">
                {fields.map((field, recordIndex) => {
                  const isLastRecord = recordIndex === 0 && fields.length === 1;
                  return (
                    <RecordForm
                      key={field.id}
                      recordIndex={recordIndex}
                      control={control}
                      errors={errors}
                      register={register}
                      removeRecord={remove}
                      exercises={props.exercises}
                      isLastRecord={isLastRecord}
                    />
                  );
                })}
              </Stack>
              <Button onClick={onClickAddExercise}>種目から追加</Button>
              <FormControl isInvalid={!!errors.records}>
                {!!errors.records && (
                  <FormErrorMessage>{errors.records.message}</FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            <Button type="submit">保存</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
};

type RecordFormProps = {
  recordIndex: number;
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  removeRecord: UseFieldArrayRemove;
  exercises: Exercise[];
  isLastRecord: boolean;
};
const RecordForm: FC<RecordFormProps> = (props) => {
  const {
    fields,
    append,
    remove: removeSet,
  } = useFieldArray({
    control: props.control,
    name: `records.${props.recordIndex}.sets`,
  });
  const [isMemoAppeared, setIsMemoAppeared] = useState(false);

  const onClickAddSet = useCallback<MouseEventHandler>(
    (_) => {
      append({
        weight: "",
        repetition: "",
      });
    },
    [append]
  );
  const onClickAddMemo = useCallback<MouseEventHandler>((_) => {
    setIsMemoAppeared(true);
  }, []);
  const onClickDeleteExercise = useCallback<MouseEventHandler>(
    (_) => {
      props.removeRecord(props.recordIndex);
    },
    [props]
  );

  return (
    <Card>
      <CardHeader>
        <Stack direction="column">
          <Stack direction="row">
            <FormControl
              isInvalid={
                !!props.errors.records?.[props.recordIndex]?.exerciseId
              }
            >
              <FormLabel>種目を選択</FormLabel>
              <Select
                {...props.register(`records.${props.recordIndex}.exerciseId`)}
              >
                {props.exercises.map((exercise) => {
                  return (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  );
                })}
              </Select>
              {!!props.errors.records?.[props.recordIndex]?.exerciseId && (
                <FormErrorMessage>
                  {
                    props.errors.records?.[props.recordIndex]?.exerciseId
                      ?.message
                  }
                </FormErrorMessage>
              )}
            </FormControl>
            <Spacer />
            <Menu>
              <MenuButton as={Button}>
                <HamburgerIcon />
              </MenuButton>
              <MenuList>
                <MenuItem justifyContent="center">
                  <InfoOutlineIcon />
                  <span>種目の詳細</span>
                </MenuItem>
                <MenuItem justifyContent="center" onClick={onClickAddMemo}>
                  <EditIcon />
                  <span>メモを追加</span>
                </MenuItem>
                <MenuItem
                  justifyContent="center"
                  onClick={onClickDeleteExercise}
                  isDisabled={props.isLastRecord}
                >
                  <CloseIcon />
                  <span>種目を削除</span>
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
          {isMemoAppeared && (
            <Textarea
              {...props.register(`records.${props.recordIndex}.memo`)}
              placeholder="メモ"
              border="none"
            />
          )}
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack direction="column">
          {fields.map((field, setIndex) => {
            const isLastSet = setIndex === 0 && fields.length === 1;
            return (
              <SetForm
                key={field.id}
                control={props.control}
                errors={props.errors}
                register={props.register}
                removeSet={removeSet}
                recordIndex={props.recordIndex}
                setIndex={setIndex}
                isLastSet={isLastSet}
              />
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
      </CardBody>
    </Card>
  );
};

type SetFormProps = {
  recordIndex: number;
  setIndex: number;
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  removeSet: UseFieldArrayRemove;
  isLastSet: boolean;
};
const SetForm: FC<SetFormProps> = (props) => {
  const onClickDeleteSet = useCallback<MouseEventHandler>(
    (_) => {
      props.removeSet(props.setIndex);
    },
    [props]
  );

  return (
    <Grid templateColumns="2fr 3fr 3fr 1fr" gap={2}>
      <GridItem>
        <Stack direction="column">
          <Text>セット</Text>
          <Text>{props.setIndex + 1}</Text>
        </Stack>
      </GridItem>
      <GridItem>
        <FormControl
          isInvalid={
            !!props.errors.records?.[props.recordIndex]?.sets?.[props.setIndex]
              ?.weight
          }
        >
          <FormLabel>重さ</FormLabel>
          <InputGroup>
            <Input
              {...props.register(
                `records.${props.recordIndex}.sets.${props.setIndex}.weight`
              )}
              type="number"
            />
            <InputRightElement>kg</InputRightElement>
          </InputGroup>
          {!!props.errors.records?.[props.recordIndex]?.sets?.[props.setIndex]
            ?.weight && (
            <FormErrorMessage>
              {
                props.errors.records?.[props.recordIndex]?.sets?.[
                  props.setIndex
                ]?.weight?.message
              }
            </FormErrorMessage>
          )}
        </FormControl>
      </GridItem>
      <GridItem>
        <FormControl
          isInvalid={
            !!props.errors.records?.[props.recordIndex]?.sets?.[props.setIndex]
              ?.repetition
          }
        >
          <FormLabel>回数</FormLabel>
          <InputGroup>
            <Input
              {...props.register(
                `records.${props.recordIndex}.sets.${props.setIndex}.repetition`
              )}
              type="number"
            />
            <InputRightElement>回</InputRightElement>
          </InputGroup>
          {!!props.errors.records?.[props.recordIndex]?.sets?.[props.setIndex]
            ?.repetition && (
            <FormErrorMessage>
              {
                props.errors.records?.[props.recordIndex]?.sets?.[
                  props.setIndex
                ]?.repetition?.message
              }
            </FormErrorMessage>
          )}
        </FormControl>
      </GridItem>
      <GridItem>
        <Button onClick={onClickDeleteSet} isDisabled={props.isLastSet}>
          <SmallCloseIcon />
        </Button>
      </GridItem>
    </Grid>
  );
};
