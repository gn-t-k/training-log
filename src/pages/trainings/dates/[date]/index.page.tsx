import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Button } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { Loading } from "@/ui/loading/loading";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";
import { useGetTrainingDate } from "@/features/training/use-get-training-date";
import { WeeklyTrainingPicker } from "@/features/training/weekly-training-picker/weekly-training-picker";

import type { Training } from "@/features/training/training";
import type { FC, ReactElement } from "react";

const TrainingsOnDatePage: NextPageWithLayout = () => {
  const trainingDate = useGetTrainingDate();

  if (trainingDate === null) {
    return <Redirect redirectTo={pagesPath.trainings.$url()} />;
  }

  return (
    <>
      <Head>
        <title>トレーニング | training-log</title>
      </Head>
      <RequireLogin>
        <TrainingsOnDate date={trainingDate} />
      </RequireLogin>
    </>
  );
};
export default TrainingsOnDatePage;
TrainingsOnDatePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="トレーニング"
        rightItem={
          // TODO: 日付の初期値を設定したい
          <Button as={NextLink} href={pagesPath.trainings.register.$url()}>
            <AddIcon />
          </Button>
        }
        leftItem={
          <Button as={NextLink} href={pagesPath.trainings.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};

type Props = {
  date: Date;
};
const TrainingsOnDate: FC<Props> = (props) => {
  // TODO 日付でトレーニング取得して表示するコンポーネント作る
  const trainingsQuery = trpc.training.getByDate.useQuery({ date: props.date });

  switch (trainingsQuery.status) {
    case "loading":
      return <Loading description="トレーニングデータを取得中" />;
    case "success":
      return (
        <TrainingsOnDateView
          date={props.date}
          trainings={trainingsQuery.data}
        />
      );
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }
};

type ViewProps = {
  date: Date;
  trainings: Training[];
};
const TrainingsOnDateView: FC<ViewProps> = (props) => {
  return (
    <Box>
      <WeeklyTrainingPicker selected={props.date} />
      <p>{JSON.stringify(props.trainings)}</p>
    </Box>
  );
};
