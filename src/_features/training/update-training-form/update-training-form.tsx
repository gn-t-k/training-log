import { useToast } from "@chakra-ui/react";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo } from "react";

import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import { GenericTrainingForm } from "../generic-training-form/generic-training-form";

import type { Training } from "../training";
import type { TrainingField } from "../use-training-form";
import type { Exercise } from "@/_features/exercise/exercise";
import type { UpdateTrainingInput } from "@/_libs/trpc/server/routes/training";
import type { MutationState } from "@/_utils/mutation-state";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

type Props = {
  training: Training;
};
export const UpdateTrainingForm: FC<Props> = (props) => {
  const util = trpc.useContext();
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const updateTrainingMutation = trpc.training.update.useMutation({
    onSuccess: async () => {
      await util.training.invalidate();
    },
  });
  const updateTraining = useCallback<ViewProps["updateTraining"]>(
    (variants) => {
      updateTrainingMutation.mutate(variants);
    },
    [updateTrainingMutation]
  );

  switch (exercisesQuery.status) {
    case "loading":
      return <Loading description="種目データを取得しています" />;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <UpdateTrainingFormView
      training={props.training}
      updateTraining={updateTraining}
      updateTrainingStatus={updateTrainingMutation.status}
      exercises={exercisesQuery.data}
    />
  );
};

type ViewProps = {
  training: Training;
  updateTraining: (training: UpdateTrainingInput) => void;
  updateTrainingStatus: MutationState;
  exercises: Exercise[];
};
export const UpdateTrainingFormView: FC<ViewProps> = (props) => {
  const toast = useToast();

  useEffect(() => {
    switch (props.updateTrainingStatus) {
      case "success":
        toast({
          title: "トレーニング記録を更新しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "トレーニング記録の更新に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [props.updateTrainingStatus, toast]);

  const defaultValues = useMemo(
    () => ({
      date: format(props.training.createdAt, "yyyy-MM-dd"),
      records: props.training.records.map((record) => ({
        exerciseId: record.exercise.id,
        sets: record.sets.map((set) => ({
          weight: String(set.weight),
          repetition: String(set.repetition),
        })),
        memo: record.memo,
      })),
    }),
    [props.training.createdAt, props.training.records]
  );

  const onSubmit = useCallback<SubmitHandler<TrainingField>>(
    (fieldValues) => {
      props.updateTraining({
        trainingId: props.training.id,
        records: fieldValues.records.flatMap((record) => {
          const exercise = props.exercises.find(
            (exercise) => exercise.id === record.exerciseId
          );
          if (exercise === undefined) {
            return [];
          }

          return [
            {
              exercise,
              sets: record.sets.map((set) => ({
                weight: Number(set.weight),
                repetition: Number(set.repetition),
              })),
              memo: record.memo,
            },
          ];
        }),
      });
    },
    [props]
  );

  const isProcessing = props.updateTrainingStatus === "loading";

  return (
    <GenericTrainingForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isProcessing={isProcessing}
      exercises={props.exercises}
    />
  );
};
