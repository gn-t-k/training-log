import { Button, Container, Stack, Text } from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import { FC, MouseEventHandler } from "react";

import { trpc } from "@/libs/trpc/client/trpc";
import {
  RegisterTrainingInput,
  UpdateTrainingInput,
} from "@/libs/trpc/server/routes/training";

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
  const updateTrainingMutation = trpc.training.updateTraining.useMutation({
    onSuccess: () => {
      util.training.invalidate();
    },
  });
  const deleteTrainingMutation = trpc.training.deleteTraining.useMutation({
    onSuccess: () => {
      util.training.invalidate();
    },
  });
  const registerTraining: ViewProps["registerTraining"] = (props) => {
    registerTrainingMutation.mutate(props);
  };
  const updateTraining: ViewProps["updateTraining"] = (props) => {
    updateTrainingMutation.mutate(props);
  };
  const deleteTraining: ViewProps["deleteTraining"] = (props) => {
    deleteTrainingMutation.mutate(props);
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
          updateTraining={updateTraining}
          deleteTraining={deleteTraining}
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  trainings: Training[];
  registerTraining: (props: RegisterTrainingInput) => void;
  updateTraining: (props: UpdateTrainingInput) => void;
  deleteTraining: (props: { id: string }) => void;
};
const TrainingsView: FC<ViewProps> = (props) => {
  const onClickRegister: MouseEventHandler = (e) => {
    e.preventDefault();

    props.registerTraining({
      records: [
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
            {
              weight: 10,
              repetition: 20,
            },
          ],
        },
        {
          exercise: {
            id: "01GPVPNA3JXP7D7191FXV83AWM",
            name: "ベンチプレス",
            targets: [
              {
                id: "01GPVPMNJ18V7X7FDWN7MRJ7CQ",
                name: "大胸筋",
              },
            ],
          },
          sets: [
            {
              weight: 70,
              repetition: 6,
            },
            {
              weight: 70,
              repetition: 6,
            },
            {
              weight: 70,
              repetition: 6,
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
        const onClickUpdate: MouseEventHandler = (e) => {
          e.preventDefault();

          props.updateTraining({
            trainingId: training.id,
            records: [
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
                ],
              },
              {
                exercise: {
                  id: "01GPVPNA3JXP7D7191FXV83AWM",
                  name: "ベンチプレス",
                  targets: [
                    {
                      id: "01GPVPMNJ18V7X7FDWN7MRJ7CQ",
                      name: "大胸筋",
                    },
                  ],
                },
                sets: [
                  {
                    weight: 70,
                    repetition: 6,
                  },
                ],
              },
            ],
          });
        };
        const onClickDelete: MouseEventHandler = (e) => {
          e.preventDefault();

          props.deleteTraining({
            id: training.id,
          });
        };

        return (
          <Stack direction="column" key={training.id}>
            <Stack direction="row">
              <Text>
                {year}年{month}月{date}日
              </Text>
              <Button onClick={onClickUpdate}>更新</Button>
              <Button onClick={onClickDelete}>削除</Button>
            </Stack>
            <Stack direction="column">
              {training.records.map((record) => (
                <Stack direction="column" key={record.exercise.id}>
                  <Text>{record.exercise.name}</Text>
                  <Stack direction="column">
                    {record.sets.map((set, index) => (
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
