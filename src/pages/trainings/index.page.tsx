import { Container, Heading, Stack } from "@chakra-ui/react";
import { getDay, getMonth, getYear, subDays } from "date-fns";
import Head from "next/head";

import type { Month } from "@/utils/date";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { WeeklyNumberOfSetsList } from "@/features/muscle/weekly-number-of-sets-list/weekly-number-of-sets-list";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { RegisterTrainingButtonAndModal } from "@/features/training/register-training-button-and-modal/register-training-button-and-modal";
import { TrainingCalendarMonth } from "@/features/training/training-calendar-month/training-calendar-month";

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
  const year = getYear(today);
  const month = getMonth(today) as Month;
  const startOfWeekDate = subDays(today, getDay(today));

  return (
    <TrainingsView
      month={month}
      TrainingCalendarMonth={
        <TrainingCalendarMonth
          today={today}
          selected={today}
          year={year}
          month={month}
        />
      }
      WeeklyNumberOfSetsList={
        <WeeklyNumberOfSetsList start={startOfWeekDate} />
      }
      RegisterTrainingButtonAndModal={<RegisterTrainingButtonAndModal />}
    />
  );
};

type ViewProps = {
  TrainingCalendarMonth: JSX.Element;
  RegisterTrainingButtonAndModal: JSX.Element;
  WeeklyNumberOfSetsList: JSX.Element;
  month: Month;
};
const TrainingsView: FC<ViewProps> = (props) => {
  return (
    <Container>
      {props.RegisterTrainingButtonAndModal}
      <Stack direction="column" gap={8}>
        <Stack as="section" direction="column" gap={2}>
          <Heading size="md">{props.month + 1}月のトレーニング記録</Heading>
          {props.TrainingCalendarMonth}
        </Stack>
        <Stack as="section" direction="column" gap={2}>
          <Heading size="md">今週の合計セット数</Heading>
          {props.WeeklyNumberOfSetsList}
        </Stack>
      </Stack>
    </Container>
  );
};
