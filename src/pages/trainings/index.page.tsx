import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
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
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { NextPageWithLayout } from "../_app.page";
import type { Training } from "@/features/training/training";
import type { FC, ReactElement } from "react";

const TrainingsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>トレーニング | training-log</title>
      </Head>
      <RequireLogin>
        <Trainings />
      </RequireLogin>
    </>
  );
};
TrainingsPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="トレーニング"
        rightItem={
          <Button as={NextLink} href={pagesPath.trainings.register.$url()}>
            <AddIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
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

  switch (getTrainingsQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニングデータを取得中</p>;
    case "success":
      return <TrainingsView trainings={getTrainingsQuery.data} />;
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  trainings: Training[];
};
const TrainingsView: FC<ViewProps> = (props) => {
  return (
    <Container>
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
    </Container>
  );
};
