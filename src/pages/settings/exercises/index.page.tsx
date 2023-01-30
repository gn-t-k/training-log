import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { ExerciseList } from "@/features/exercise/exercise-list/exercise-list";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { NextPageWithLayout } from "../../_app.page";
import type { FC, ReactElement } from "react";

const ExercisesPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>種目 | training-log</title>
      </Head>
      <RequireLogin>
        <Exercises />
      </RequireLogin>
    </>
  );
};
ExercisesPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="種目"
        leftItem={
          <Button as={NextLink} href={pagesPath.settings.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
        rightItem={
          <Button
            as={NextLink}
            href={pagesPath.settings.exercises.register.$url()}
          >
            <AddIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default ExercisesPage;

const Exercises: FC = () => {
  return <ExercisesView ExerciseList={<ExerciseList />} />;
};

type ViewProps = {
  ExerciseList: JSX.Element;
};
const ExercisesView: FC<ViewProps> = (props) => {
  return <Container>{props.ExerciseList}</Container>;
};
