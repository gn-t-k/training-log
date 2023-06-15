import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";


import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { RegisterExerciseForm } from "@/_features/exercise/register-exercise-form/register-exercise-form";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { pagesPath } from "@/_libs/pathpida/$path";

import type { NextPageWithLayout } from "@/_pages/_app.page";
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
          // <Button as={NextLink} href={pagesPath.settings.exercises.$url()}>
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
