import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";

const RegisterExercise: NextPage = () => {
  const router = useRouter();
  const goToExercisesPage: MouseEventHandler = (e) => {
    e.preventDefault();

    router.push(pagesPath.exercises.$url());
  };

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={goToExercisesPage}>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
        </Stack>
        <Heading>種目を登録</Heading>
        <RegisterExerciseForm />
      </Stack>
    </Container>
  );
};
export default RegisterExercise;
