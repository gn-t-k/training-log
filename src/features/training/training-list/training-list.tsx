import { Card, CardBody, Heading, Stack, Text } from "@chakra-ui/react";
import { addMinutes } from "date-fns";

import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import { DeleteTrainingButtonAndDialog } from "@/features/training/delete-training-button-and-dialog/delete-training-button-and-dialog";

import { EditTrainingButtonAndModal } from "../edit-training-button-and-modal/edit-training-button-and-modal";

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
            <EditTrainingButtonAndModal training={training} />
            <DeleteTrainingButtonAndDialog training={training} />
          </Stack>
        );
      })}
    </Stack>
  );
};
