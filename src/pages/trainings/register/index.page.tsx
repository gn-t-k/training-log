import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";

const RegisterTrainingPage: NextPage = () => {
  const router = useRouter();
  const goToTrainingsPage = useCallback<Props["goToTrainingsPage"]>(() => {
    router.push(pagesPath.trainings.$url());
  }, [router]);

  return (
    <RequireLogin>
      <RegisterTraining goToTrainingsPage={goToTrainingsPage} />
    </RequireLogin>
  );
};
export default RegisterTrainingPage;

type Props = {
  goToTrainingsPage: () => void;
};
const RegisterTraining: FC<Props> = (props) => {
  return <RegisterTrainingView goToTrainingsPage={props.goToTrainingsPage} />;
};

type ViewProps = {
  goToTrainingsPage: () => void;
};
const RegisterTrainingView: FC<ViewProps> = (props) => {
  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTrainingsPage();
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={onClickBack}>
            <ChevronLeftIcon />
          </Button>
          <Heading>トレーニングを記録する</Heading>
        </Stack>
        <form></form>
      </Stack>
    </Container>
  );
};
