import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback } from "react";


import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";
import type { RegisterTrainingInput } from "@/libs/trpc/server/routes/training";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { TrainingForm } from "@/features/training/training-form/training-form";

import type { Exercise } from "@/features/exercise/exercise";
import type { TrainingField } from "@/features/training/use-training-form";
import type { NextPage } from "next";
import type { FC, MouseEventHandler} from "react";
import type { SubmitHandler } from "react-hook-form";

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
          isProcessing={registerTrainingMutation.status === "loading"}
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
  isProcessing: boolean;
};
const RegisterTrainingView: FC<ViewProps> = (props) => {
  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTrainingsPage();
    },
    [props]
  );

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
        <TrainingForm
          onSubmit={onSubmit}
          exercises={props.exercises}
          isProcessing={props.isProcessing}
        />
      </Stack>
    </Container>
  );
};
