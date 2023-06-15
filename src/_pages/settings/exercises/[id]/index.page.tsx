import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";



import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { DeleteExerciseButtonAndDialog } from "@/_features/exercise/delete-exercise-button-and-dialog/delete-exercise-button-and-dialog";
import { UpdateExerciseForm } from "@/_features/exercise/update-exercise-form/update-exercise-form";
import { useGetExerciseId } from "@/_features/exercise/use-get-exercise-id";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import type { NextPageWithLayout } from "@/_pages/_app.page";
import type { FC, ReactElement } from "react";

const ExercisePage: NextPageWithLayout = () => {
  const id = useGetExerciseId();

  if (id === null) {
    // return <Redirect redirectTo={pagesPath.settings.exercises.$url()} />;
    return <Redirect redirectTo={pagesPath.$url()} />;
  }

  return (
    <>
      <Head>
        <title>種目を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <ExerciseComponent id={id} />
      </RequireLogin>
    </>
  );
};
ExercisePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="種目を編集する"
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
export default ExercisePage;

type Props = {
  id: string;
};
const ExerciseComponent: FC<Props> = (props) => {
  const exerciseQuery = trpc.exercise.getById.useQuery({
    id: props.id,
  });

  switch (exerciseQuery.status) {
    case "loading":
      return <Loading description="種目データを取得しています" />;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <ExerciseView
      UpdateExerciseForm={<UpdateExerciseForm exercise={exerciseQuery.data} />}
      DeleteExerciseButtonAndDialog={
        <DeleteExerciseButtonAndDialog exercise={exerciseQuery.data} />
      }
    />
  );
};

type ViewProps = {
  UpdateExerciseForm: JSX.Element;
  DeleteExerciseButtonAndDialog: JSX.Element;
};
export const ExerciseView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        {props.UpdateExerciseForm}
        {props.DeleteExerciseButtonAndDialog}
      </Stack>
    </Container>
  );
};
