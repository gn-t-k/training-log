import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";


import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/_features/navigation/redirect/redirect";
import { RegisterTrainingButtonAndModal } from "@/_features/training/register-training-button-and-modal/register-training-button-and-modal";
import { TrainingList } from "@/_features/training/training-list/training-list";
import { useGetTrainingDate } from "@/_features/training/use-get-training-date";
import { WeeklyTrainingPicker } from "@/_features/training/weekly-training-picker/weekly-training-picker";
import { pagesPath } from "@/_libs/pathpida/$path";

import type { NextPageWithLayout } from "@/_pages/_app.page";
import type { FC, ReactElement } from "react";

const TrainingsOnDatePage: NextPageWithLayout = () => {
  const trainingDate = useGetTrainingDate();

  if (trainingDate === null) {
    // return <Redirect redirectTo={pagesPath.trainings.$url()} />;
    return <Redirect redirectTo={pagesPath.$url()} />;
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
          // <Button as={NextLink} href={pagesPath.trainings.$url()}>
          <Button as={NextLink} href={pagesPath.$url()}>
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
