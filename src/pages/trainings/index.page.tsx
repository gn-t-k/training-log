import { Button, Container, Stack, Text } from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import { FC, MouseEventHandler } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Training } from "@/features/training/training";

const TrainingsPage: NextPage = () => {
  return (
    <RequireLogin>
      <Trainings />
    </RequireLogin>
  );
};
export default TrainingsPage;

const Trainings: FC = () => {
  const today = new Date();
  const [thisYear, thisMonth] = [getYear(today), getMonth(today)];
  const util = trpc.useContext();
  const getTrainingsQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: thisYear,
    month: thisMonth,
  });
  const registerTrainingMutation = trpc.training.register.useMutation({
    onSuccess: () => {
      util.training.invalidate();
    },
  });
  const registerTraining: ViewProps["registerTraining"] = (training) => {
    registerTrainingMutation.mutate({
      createdAt: training.createdAt,
      exercises: training.exercises,
    });
  };

  switch (getTrainingsQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニングデータを取得中</p>;
    case "success":
      return (
        <TrainingsView
          trainings={getTrainingsQuery.data}
          registerTraining={registerTraining}
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  trainings: Training[];
  registerTraining: (training: Omit<Training, "id">) => void;
};
const TrainingsView: FC<ViewProps> = (props) => {
  const onClickRegister: MouseEventHandler = (e) => {
    e.preventDefault();

    props.registerTraining({
      createdAt: new Date(2020, 0),
      exercises: [
        {
          exercise: {
            id: "01GPSAEFGBEMS8YRPCJ45E2EJX",
            name: "アームカール",
            targets: [
              {
                id: "01GPSAE03ZEAC9411KZ2HBRHH0",
                name: "上腕二頭筋",
              },
            ],
          },
          sets: [
            {
              weight: 10,
              repetition: 20,
            },
            {
              weight: 10,
              repetition: 20,
            },
          ],
        },
        {
          exercise: {
            id: "01GPVPNA3JXP7D7191FXV83AWM",
            name: "	ベンチプレス",
            targets: [
              {
                id: "01GP10MPJ7SFD1K26CZ9KZMTA1",
                name: "大胸筋",
              },
            ],
          },
          sets: [
            {
              weight: 60,
              repetition: 10,
            },
            {
              weight: 60,
              repetition: 10,
            },
          ],
        },
      ],
    });
  };
  return (
    <Container>
      <Button onClick={onClickRegister}>トレーニングを登録</Button>
      {props.trainings.map((training) => {
        const [year, month, date] = [
          getYear(training.createdAt),
          getMonth(training.createdAt) + 1,
          getDate(training.createdAt),
        ];
        return (
          <Stack direction="column" key={training.id}>
            <Text>
              {year}年{month}月{date}日
            </Text>
            <Stack direction="column">
              {training.exercises.map((exercise) => (
                <Stack key={exercise.exercise.id}>
                  <Text>{exercise.exercise.name}</Text>
                  <Stack direction="column">
                    {exercise.sets.map((set, index) => (
                      <Stack key={index} direction="row">
                        <Text>{set.weight}kg</Text>
                        <Text>{set.repetition} rep</Text>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Container>
  );
};
