import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";

import type { FC, ReactElement } from "react";

const RegisterExercisePage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <RegisterExercise />
    </RequireLogin>
  );
};
RegisterExercisePage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
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
  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.settings.exercises.$url()}>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
        </Stack>
        <Heading>種目を登録</Heading>
        {props.RegisterExerciseForm}
      </Stack>
    </Container>
  );
};
