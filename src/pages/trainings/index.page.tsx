import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getDate, getMonth, getYear } from "date-fns";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";

import type { NextPageWithLayout } from "../_app.page";
import type { Training } from "@/features/training/training";
import type { FC, MouseEventHandler, ReactElement } from "react";

const TrainingsPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Head>
        <title>トレーニング | training-log</title>
      </Head>
      <Trainings />
    </RequireLogin>
  );
};
TrainingsPage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
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
  const deleteTrainingMutation = trpc.training.deleteTraining.useMutation({
    onSuccess: () => {
      util.training.invalidate();
    },
  });
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
          deleteTraining={deleteTraining}
          isDeleteProcessing={deleteTrainingMutation.status === "loading"}
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  trainings: Training[];
  deleteTraining: (props: { id: string }) => void;
  isDeleteProcessing: boolean;
};
const TrainingsView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Heading>トレーニング</Heading>
          <Spacer />
          <Button as={NextLink} href={pagesPath.trainings.register.$url()}>
            <AddIcon />
          </Button>
        </Stack>
        {props.trainings
          .sort(
            (left, right) =>
              right.createdAt.getTime() - left.createdAt.getTime()
          )
          .map((training) => {
            const [year, month, date] = [
              getYear(training.createdAt),
              getMonth(training.createdAt) + 1,
              getDate(training.createdAt),
            ];
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
                <Button
                  as={NextLink}
                  href={pagesPath.trainings._id(training.id).$url()}
                >
                  トレーニング記録を編集
                </Button>
                <Button
                  onClick={onClickDelete}
                  isDisabled={props.isDeleteProcessing}
                  isLoading={props.isDeleteProcessing}
                >
                  トレーニング記録を削除
                </Button>
              </Stack>
            );
          })}
      </Stack>
    </Container>
  );
};
