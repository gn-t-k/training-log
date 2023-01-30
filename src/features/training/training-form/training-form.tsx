import {
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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
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
import { useCallback, useState } from "react";
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
  exercises: Exercise[];
  onSubmit: SubmitHandler<TrainingField>;
  isProcessing: boolean;
};
export const TrainingForm: FC<Props> = (props) => {
  return (
    <TrainingFormView
      defaultValues={props.defaultValues}
      onSubmit={props.onSubmit}
      exercises={props.exercises}
      isProcessing={props.isProcessing}
    />
  );
};

type ViewProps = {
  defaultValues?: TrainingField;
  onSubmit: SubmitHandler<TrainingField>;
  exercises: Exercise[];
  isProcessing: boolean;
};
export const TrainingFormView: FC<ViewProps> = (props) => {
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
          <Button onClick={onClickAddExercise}>種目から追加</Button>
          <Button isDisabled={true}>テンプレートから追加</Button>
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
  const onClickDeleteMemo = useCallback<MouseEventHandler>(
    (_) => {
      setIsMemoAppeared(false);
      props.setValue(`records.${props.recordIndex}.memo`, "");
    },
    [props]
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
                {isMemoAppeared ? (
                  <MenuItem justifyContent="center" onClick={onClickDeleteMemo}>
                    <EditIcon />
                    <span>メモを削除</span>
                  </MenuItem>
                ) : (
                  <MenuItem justifyContent="center" onClick={onClickAddMemo}>
                    <EditIcon />
                    <span>メモを追加</span>
                  </MenuItem>
                )}
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
              pattern="^([1-9]\d*|0)(\.\d+)?$"
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
              pattern="^([1-9]\d*|0)(\.\d+)?$"
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
