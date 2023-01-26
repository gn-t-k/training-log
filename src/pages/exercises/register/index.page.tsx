import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";

import type { NextPage } from "next";
import type { FC } from "react";

const RegisterExercisePage: NextPage = () => {
  return (
    <RequireLogin>
      <RegisterExercise />
    </RequireLogin>
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
  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.exercises.$url()}>
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
