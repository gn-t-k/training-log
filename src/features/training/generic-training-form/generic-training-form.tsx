import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CloseButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useFieldArray } from "react-hook-form";

import { useTrainingFrom } from "../use-training-form";

import type { TrainingField } from "../use-training-form";
import type { Exercise } from "@/features/exercise/exercise";
import type { FC, MouseEventHandler } from "react";
import type {
  SubmitHandler,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";

type Props = {
  defaultValues?: TrainingField;
  onSubmit: SubmitHandler<TrainingField>;
  isProcessing: boolean;
  exercises: Exercise[];
};
export const GenericTrainingForm: FC<Props> = (props) => {
  return (
    <GenericTrainingFormView
      defaultValues={props.defaultValues}
      onSubmit={props.onSubmit}
      isProcessing={props.isProcessing}
      exercises={props.exercises}
    />
  );
};

type ViewProps = {
  defaultValues?: TrainingField;
  onSubmit: SubmitHandler<TrainingField>;
  isProcessing: boolean;
  exercises: Exercise[];
};
export const GenericTrainingFormView: FC<ViewProps> = (props) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useTrainingFrom(props.defaultValues);
  const { fields, append, remove } = useFieldArray({
    control: control,
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

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
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
                  setValue={setValue}
                  removeRecord={remove}
                  exercises={props.exercises}
                  isLastRecord={isLastRecord}
                />
              );
            })}
          </Stack>
          <Button onClick={onClickAddExercise}>種目を追加</Button>
          <FormControl isInvalid={!!errors.records}>
            {!!errors.records && (
              <FormErrorMessage>{errors.records.message}</FormErrorMessage>
            )}
          </FormControl>
        </Stack>
        <Button
          type="submit"
          isLoading={props.isProcessing}
          isDisabled={props.isProcessing}
        >
          保存
        </Button>
      </Stack>
    </form>
  );
};

type RecordFormProps = {
  recordIndex: number;
  control: UseFormReturn<TrainingField>["control"];
  errors: UseFormReturn<TrainingField>["formState"]["errors"];
  register: UseFormReturn<TrainingField>["register"];
  setValue: UseFormReturn<TrainingField>["setValue"];
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

  const onClickAddSet = useCallback<MouseEventHandler>(
    (_) => {
      append({
        weight: "",
        repetition: "",
      });
    },
    [append]
  );
  const onClickDeleteExercise = useCallback<MouseEventHandler>(
    (_) => {
      props.removeRecord(props.recordIndex);
    },
    [props]
  );

  return (
    <Card>
      <CardHeader>
        <Stack direction="row">
          <Spacer />
          <CloseButton
            onClick={onClickDeleteExercise}
            isDisabled={props.isLastRecord}
          />
        </Stack>
        <Stack direction="row">
          <FormControl
            isInvalid={!!props.errors.records?.[props.recordIndex]?.exerciseId}
          >
            <FormLabel>種目を選択</FormLabel>
            <Stack direction="row" alignItems="center">
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
              {/* TODO: 前回の重量とかそういうの出るようにする */}
              <IconButton
                icon={<InfoOutlineIcon />}
                isDisabled={true}
                aria-label="種目の情報"
                variant="unstyled"
              />
            </Stack>
            {!!props.errors.records?.[props.recordIndex]?.exerciseId && (
              <FormErrorMessage>
                {props.errors.records?.[props.recordIndex]?.exerciseId?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </Stack>
      </CardHeader>
      <CardBody>
        <Stack direction="column" gap={4}>
          <Stack direction="column">
            <Grid templateColumns="2fr 3fr 3fr 1fr">
              <GridItem>
                <Text>セット</Text>
              </GridItem>
              <GridItem>
                <FormLabel as="legend">重さ</FormLabel>
              </GridItem>
              <GridItem>
                <FormLabel as="legend">回数</FormLabel>
              </GridItem>
            </Grid>
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
            </Stack>
            <Button onClick={onClickAddSet}>セットを追加</Button>
          </Stack>
          {!!props.errors.records?.[props.recordIndex]?.sets && (
            <FormControl
              isInvalid={!!props.errors.records[props.recordIndex]?.sets}
            >
              <FormErrorMessage>
                {props.errors.records[props.recordIndex]?.sets?.message}
              </FormErrorMessage>
            </FormControl>
          )}
          <Textarea
            {...props.register(`records.${props.recordIndex}.memo`)}
            placeholder="メモ"
          />
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
          <InputGroup>
            <Input
              {...props.register(
                `records.${props.recordIndex}.sets.${props.setIndex}.weight`
              )}
              type="number"
              step="0.01"
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
          <InputGroup>
            <Input
              {...props.register(
                `records.${props.recordIndex}.sets.${props.setIndex}.repetition`
              )}
              type="number"
              pattern="[0-9]*"
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
        <CloseButton onClick={onClickDeleteSet} isDisabled={props.isLastSet} />
      </GridItem>
    </Grid>
  );
};
