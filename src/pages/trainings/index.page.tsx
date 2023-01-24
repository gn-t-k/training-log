import { Button, Container, Stack, Text } from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import { NextPage } from "next";
import NextLink from "next/link";
import { FC, MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
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
  return (
    <Container>
      <Button as={NextLink} href={pagesPath.trainings.register.$url()}>
        トレーニングを登録
      </Button>
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
                  id: "01GQC48CRVSFWKR76PXFTR45K9",
                  name: "アームカール",
                  targets: [
                    {
                      id: "01GQC47GY1MCWM2CB11S9MR7BP",
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
                memo: "",
              },
              {
                exercise: {
                  id: "01GQC47XZRC3KGR9PKWD83VD3F",
                  name: "ベンチプレス",
                  targets: [
                    {
                      id: "01GQC479NHD83PYN5A7J4M86SE",
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
                memo: "よくできた",
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
                    <Text>{record.memo}</Text>
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
