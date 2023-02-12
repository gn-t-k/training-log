import { Button, Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { addMinutes } from "date-fns";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import { DeleteTrainingButtonAndDialog } from "@/features/training/delete-training-button-and-dialog/delete-training-button-and-dialog";

import type { Training } from "@/features/training/training";
import type { FC } from "react";

type Props = {
  date: Date;
};
export const TrainingList: FC<Props> = (props) => {
  // サーバー側の時間はUTCなので合わせる
  const utcDate = addMinutes(props.date, props.date.getTimezoneOffset());
  const getTrainingsQuery = trpc.training.getByDate.useQuery({
    date: utcDate,
  });

  switch (getTrainingsQuery.status) {
    case "loading":
      return <Loading description="トレーニングデータを取得しています" />;
    case "success":
      return <TrainingListView trainings={getTrainingsQuery.data} />;
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  trainings: Training[];
};
export const TrainingListView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column" gap={8}>
      {props.trainings.map((training) => {
        return (
          <Stack key={training.id} direction="column">
            {training.records.map((record) => {
              return (
                <Card key={record.id}>
                  <CardBody>
                    <Stack direction="column">
                      <Heading size="sm">{record.exercise.name}</Heading>
                      <Text>{record.memo}</Text>
                      {record.sets.map((set, index) => {
                        return (
                          <Stack key={index} direction="row">
                            <Text>{set.weight}kg</Text>
                            <Text>{set.repetition} rep</Text>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </CardBody>
                </Card>
              );
            })}
            <Button
              as={NextLink}
              href={pagesPath.trainings._id(training.id).$url()}
            >
              トレーニング記録を編集
            </Button>
            <DeleteTrainingButtonAndDialog training={training} />
          </Stack>
        );
      })}
    </Stack>
  );
};
