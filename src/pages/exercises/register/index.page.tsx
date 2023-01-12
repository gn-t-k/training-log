import { Container, Heading, Stack } from "@chakra-ui/react";
import { NextPage } from "next";

import { RegisterExerciseForm } from "@/features/exercise/register-exercise-form/register-exercise-form";

const RegisterExercise: NextPage = () => {
  return (
    <Container>
      <Stack direction="column">
        <Heading>種目を登録</Heading>
        <RegisterExerciseForm />
      </Stack>
    </Container>
  );
};
export default RegisterExercise;
