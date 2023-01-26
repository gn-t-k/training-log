import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";
import type { UpdateTrainingInput } from "@/libs/trpc/server/routes/training";

import { Redirect } from "@/ui/redirect/redirect";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Training } from "@/features/training/training";
import { TrainingForm } from "@/features/training/training-form/training-form";
import { useGetTrainingId } from "@/features/training/use-get-training-id";

import type { Exercise } from "@/features/exercise/exercise";
import type { TrainingField } from "@/features/training/use-training-form";
import type { NextPage } from "next";
import type { FC } from "react";
import type { SubmitHandler } from "react-hook-form";

const TrainingPage: NextPage = () => {
  const router = useRouter();
  const id = useGetTrainingId();

  const goToTrainingsPage = useCallback(() => {
    router.push(pagesPath.trainings.$url());
  }, [router]);

  if (id === null) {
    return <Redirect redirectTo={pagesPath.trainings.$url()} />;
  }

  return (
    <RequireLogin>
      <Training id={id} goToTrainingsPage={goToTrainingsPage} />
    </RequireLogin>
  );
};
export default TrainingPage;

type Props = {
  id: string;
  goToTrainingsPage: () => void;
};
const Training: FC<Props> = (props) => {
  const util = trpc.useContext();
  const trainingQuery = trpc.training.getById.useQuery({ id: props.id });
  const exerciseQuery = trpc.exercise.getAll.useQuery();
  const updateTrainingMutation = trpc.training.update.useMutation({
    onSuccess: () => {
      util.training.invalidate();
      props.goToTrainingsPage();
    },
  });
  const updateTraining = useCallback<ViewProps["updateTraining"]>(
    (variants) => {
      updateTrainingMutation.mutate(variants);
    },
    [updateTrainingMutation]
  );

  switch (trainingQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニングデータを取得中</p>;
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }

  switch (exerciseQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <TrainingView
      training={trainingQuery.data}
      exercises={exerciseQuery.data}
      updateTraining={updateTraining}
      isProcessing={updateTrainingMutation.status === "loading"}
    />
  );
};

type ViewProps = {
  training: Training;
  exercises: Exercise[];
  updateTraining: (training: UpdateTrainingInput) => void;
  isProcessing: boolean;
};
const TrainingView: FC<ViewProps> = (props) => {
  const trainingField = useMemo<TrainingField>(
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
                weight: parseInt(set.weight),
                repetition: parseInt(set.repetition),
              })),
              memo: record.memo,
            },
          ];
        }),
      });
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.trainings.$url()}>
            <ChevronLeftIcon />
          </Button>
          <Heading>トレーニング記録を編集する</Heading>
        </Stack>
        <TrainingForm
          defaultValues={trainingField}
          exercises={props.exercises}
          onSubmit={onSubmit}
          isProcessing={props.isProcessing}
        />
      </Stack>
    </Container>
  );
};
