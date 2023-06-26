import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";
import { RegisterTrainingButtonAndModal } from "@/features/training/register-training-button-and-modal/register-training-button-and-modal";
import { TrainingList } from "@/features/training/training-list/training-list";
import { useGetTrainingDate } from "@/features/training/use-get-training-date";
import { WeeklyTrainingPicker } from "@/features/training/weekly-training-picker/weekly-training-picker";

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
  return (
    <TrainingsOnDateView
      WeeklyTrainingPicker={<WeeklyTrainingPicker selected={props.date} />}
      TrainingList={<TrainingList date={props.date} />}
      RegisterTrainingButtonAndModal={<RegisterTrainingButtonAndModal />}
    />
  );
};

type ViewProps = {
  WeeklyTrainingPicker: JSX.Element;
  TrainingList: JSX.Element;
  RegisterTrainingButtonAndModal: JSX.Element;
};
const TrainingsOnDateView: FC<ViewProps> = (props) => {
  return (
    <Container>
      {props.RegisterTrainingButtonAndModal}
      {props.WeeklyTrainingPicker}
      {props.TrainingList}
    </Container>
  );
};
