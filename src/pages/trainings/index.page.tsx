import { AddIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { TrainingList } from "@/features/training/training-list/training-list";

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
  return <TrainingsView TrainingList={<TrainingList />} />;
};

type ViewProps = {
  TrainingList: JSX.Element;
};
const TrainingsView: FC<ViewProps> = (props) => {
  return <Container>{props.TrainingList}</Container>;
};
