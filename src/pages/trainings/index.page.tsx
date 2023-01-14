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
  const getTrainingsQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: thisYear,
    month: thisMonth,
  });
  const registerTrainingMutation = trpc.training.register.useMutation();
  const registerTraining: ViewProps["registerTraining"] = (training) => {
    registerTrainingMutation.mutate({
      trainingSets: training.trainingSets,
      createdAt: training.createdAt,
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
      trainingSets: [
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
          weight: 10,
          repetition: 20,
        },
      ],
      createdAt: new Date(),
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
              {training.trainingSets.map((set, index) => (
                <Stack key={index} direction="row">
                  <Text>{set.exercise.name}</Text>
                  <Text>{set.weight}kg</Text>
                  <Text>{set.repetition}回</Text>
                </Stack>
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Container>
  );
};
