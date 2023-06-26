import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { FC, ReactElement } from "react";

const RegisterExercisePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>種目を登録する | training-log</title>
      </Head>
      <RequireLogin>
        <RegisterExercise />
      </RequireLogin>
    </>
  );
};
RegisterExercisePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="種目を登録する"
        leftItem={
          <Button as={NextLink} href={pagesPath.settings.exercises.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default RegisterExercisePage;

const RegisterExercise: FC = () => {
  return (
    <RegisterExerciseView RegisterExerciseForm={<RegisterExerciseForm />} />
  );
};

type ViewProps = {
  RegisterExerciseForm: JSX.Element;
};
const RegisterExerciseView: FC<ViewProps> = (props) => {
  return <Container>{props.RegisterExerciseForm}</Container>;
};
