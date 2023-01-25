import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";

const RegisterExercisePage: NextPage = () => {
  const router = useRouter();
  const goToExercisesPage: Props["goToExercisesPage"] = () => {
    router.push(pagesPath.exercises.$url());
  };

  return (
    <RequireLogin>
      <RegisterExercise goToExercisesPage={goToExercisesPage} />
    </RequireLogin>
  );
};
export default RegisterExercisePage;

type Props = {
  goToExercisesPage: () => void;
};
const RegisterExercise: FC<Props> = (props) => {
  return (
    <RegisterExerciseView
      goToExercisesPage={props.goToExercisesPage}
      RegisterExerciseForm={<RegisterExerciseForm />}
    />
  );
};

type ViewProps = {
  goToExercisesPage: () => void;
  RegisterExerciseForm: JSX.Element;
};
const RegisterExerciseView: FC<ViewProps> = (props) => {
  const onClickBack: MouseEventHandler = (e) => {
    e.preventDefault();

    props.goToExercisesPage();
  };

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={onClickBack}>
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
