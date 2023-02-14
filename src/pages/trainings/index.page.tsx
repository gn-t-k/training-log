import { Container } from "@chakra-ui/react";
import Head from "next/head";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { MonthlyTrainingPicker } from "@/features/training/monthly-training-picker/monthly-training-picker";
import { RegisterTrainingButton } from "@/features/training/register-training-button/register-training-button";

import type { NextPageWithLayout } from "../_app.page";
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
      <HeaderNavigation title="トレーニング">{page}</HeaderNavigation>
    </FooterNavigation>
  );
};
export default TrainingsPage;

const Trainings: FC = () => {
  const today = new Date();

  return (
    <TrainingsView
      MonthlyTrainingPicker={<MonthlyTrainingPicker selected={today} />}
    />
  );
};

type ViewProps = {
  MonthlyTrainingPicker: JSX.Element;
};
const TrainingsView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <RegisterTrainingButton />
      {props.MonthlyTrainingPicker}
    </Container>
  );
};
