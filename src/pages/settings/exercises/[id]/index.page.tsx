import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { Loading } from "@/ui/loading/loading";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { DeleteExerciseButtonAndDialog } from "@/features/exercise/delete-exercise-button-and-dialog/delete-exercise-button-and-dialog";
import { UpdateExerciseForm } from "@/features/exercise/update-exercise-form/update-exercise-form";
import { useGetExerciseId } from "@/features/exercise/use-get-exercise-id";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { FC, ReactElement } from "react";

const ExercisePage: NextPageWithLayout = () => {
  const id = useGetExerciseId();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.settings.exercises.$url()} />;
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
