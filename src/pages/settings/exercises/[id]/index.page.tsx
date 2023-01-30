import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Spinner, useToast } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { UpdateExerciseForm } from "@/features/exercise/update-exercise-form/update-exercise-form";
import { useGetExerciseId } from "@/features/exercise/use-get-exercise-id";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { Exercise } from "@/features/exercise/exercise";
import type { FC, MouseEventHandler, ReactElement } from "react";

const ExercisePage: NextPageWithLayout = () => {
  const id = useGetExerciseId();
  const router = useRouter();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.settings.exercises.$url()} />;
  }

  const goToExercisesPage: Props["goToExercisesPage"] = () => {
    router.push(pagesPath.settings.exercises.$url());
  };

  return (
    <>
      <Head>
        <title>種目を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <ExerciseComponent id={id} goToExercisesPage={goToExercisesPage} />
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
  goToExercisesPage: () => void;
};
const ExerciseComponent: FC<Props> = (props) => {
  const util = trpc.useContext();
  const exerciseQuery = trpc.exercise.getById.useQuery({
    id: props.id,
  });
  const deleteExerciseMutation = trpc.exercise.delete.useMutation({
    onSuccess: () => {
      util.exercise.invalidate();
      props.goToExercisesPage();
    },
  });

  const deleteExercise: ViewProps["deleteExercise"] = (id) => {
    deleteExerciseMutation.mutate({ id });
  };

  switch (exerciseQuery.status) {
    case "loading":
      // TODO
      return <p>種目データを取得中</p>;
    case "error":
      // TODO
      return <p>種目データの取得に失敗しました</p>;
  }

  return (
    <ExerciseView
      exercise={exerciseQuery.data}
      deleteExercise={deleteExercise}
      deleteExerciseStatus={deleteExerciseMutation.status}
    />
  );
};

type ViewProps = {
  exercise: Exercise;
  deleteExercise: (id: string) => void;
  deleteExerciseStatus: MutationState;
};
export const ExerciseView: FC<ViewProps> = (props) => {
  const toast = useToast();
  useEffect(() => {
    switch (props.deleteExerciseStatus) {
      case "idle":
      case "loading":
        return;
      case "success":
        toast({
          title: "種目を削除しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "種目の削除に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.deleteExerciseStatus, toast]);

  const onClickDelete: MouseEventHandler = (e) => {
    e.preventDefault();

    props.deleteExercise(props.exercise.id);
  };
  const isLoading = props.deleteExerciseStatus === "loading";

  return (
    <Container>
      <UpdateExerciseForm exercise={props.exercise} />
      <Button onClick={onClickDelete} isDisabled={isLoading}>
        {isLoading ? <Spinner /> : "種目を削除"}
      </Button>
    </Container>
  );
};
