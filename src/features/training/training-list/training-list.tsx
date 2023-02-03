import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { addMinutes, getDate, getMonth, getYear } from "date-fns";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Training } from "@/features/training/training";
import type { FC } from "react";

export const TrainingList: FC = () => {
  const today = new Date();
  // サーバー側の時間はUTCなので合わせる
  const utcToday = addMinutes(today, today.getTimezoneOffset());
  const [thisYear, thisMonth] = [getYear(utcToday), getMonth(utcToday)];
  const getTrainingsQuery = trpc.training.getMonthlyTrainings.useQuery({
    year: thisYear,
    month: thisMonth,
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
    <Stack direction="column">
      {props.trainings
        .sort(
          (left, right) => right.createdAt.getTime() - left.createdAt.getTime()
        )
        .map((training) => {
          const [year, month, date] = [
            getYear(training.createdAt),
            getMonth(training.createdAt) + 1,
            getDate(training.createdAt),
          ];

          return (
            <Card
              key={training.id}
              mb={4}
              as={NextLink}
              href={pagesPath.trainings._id(training.id).$url()}
            >
              <CardHeader>
                <Heading size="sm">
                  {year}年{month}月{date}日
                </Heading>
              </CardHeader>
              <CardBody>
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
              </CardBody>
            </Card>
          );
        })}
    </Stack>
  );
};
