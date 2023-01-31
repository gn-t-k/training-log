import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";
import type { RegisterTrainingInput } from "@/libs/trpc/server/routes/training";

import type { MutationState } from "@/utils/mutation-state";

import { GenericTrainingForm } from "../generic-training-form/generic-training-form";

import type { TrainingField } from "../use-training-form";
import type { Exercise } from "@/features/exercise/exercise";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

export const RegisterTrainingForm: FC = () => {
  const router = useRouter();
  const util = trpc.useContext();
  const exercisesQuery = trpc.exercise.getAll.useQuery();
  const registerTrainingMutation = trpc.training.register.useMutation({
    onSuccess: () => {
      util.training.invalidate();
      router.push(pagesPath.trainings.$url());
    },
  });
  const registerTraining = useCallback<ViewProps["registerTraining"]>(
    (variants) => {
      registerTrainingMutation.mutate(variants);
    },
    [registerTrainingMutation]
  );

  switch (exercisesQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <RegisterTrainingFormView
      registerTraining={registerTraining}
      registerTrainingStatus={registerTrainingMutation.status}
      exercises={exercisesQuery.data}
    />
  );
};

type ViewProps = {
  registerTraining: (training: RegisterTrainingInput) => void;
  registerTrainingStatus: MutationState;
  exercises: Exercise[];
};
export const RegisterTrainingFormView: FC<ViewProps> = (props) => {
  const toast = useToast();

  useEffect(() => {
    switch (props.registerTrainingStatus) {
      case "success":
        toast({
          title: "トレーニング記録を登録しました",
          status: "success",
          isClosable: true,
        });
        return;
      case "error":
        toast({
          title: "トレーニング記録の登録に失敗しました",
          status: "error",
          isClosable: true,
        });
        return;
    }
  }, [props.registerTrainingStatus, toast]);

  const onSubmit = useCallback<SubmitHandler<TrainingField>>(
    (fieldValues) => {
      const createdAt = new Date();
      const records = fieldValues.records.flatMap((record) => {
        const exercise = props.exercises.find(
          (exercise) => exercise.id === record.exerciseId
        );

        if (exercise === undefined) {
          return [];
        }

        const sets = record.sets.map((set) => ({
          weight: Number(set.weight),
          repetition: Number(set.repetition),
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

  const isProcessing = props.registerTrainingStatus === "loading";

  return (
    <GenericTrainingForm
      onSubmit={onSubmit}
      isProcessing={isProcessing}
      exercises={props.exercises}
    />
  );
};
