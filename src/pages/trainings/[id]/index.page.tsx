import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";
import { UpdateTrainingForm } from "@/features/training/update-training-form/update-training-form";
import { useGetTrainingId } from "@/features/training/use-get-training-id";

import type { FC, ReactElement, MouseEventHandler } from "react";

const TrainingPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = useGetTrainingId();

  const goToTrainingsPage = useCallback(() => {
    router.push(pagesPath.trainings.$url());
  }, [router]);

  if (id === null) {
    return <Redirect redirectTo={pagesPath.trainings.$url()} />;
  }

  return (
    <>
      <Head>
        <title>トレーニング記録を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <Training id={id} goToTrainingsPage={goToTrainingsPage} />
      </RequireLogin>
    </>
  );
};
TrainingPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="トレーニング記録を編集する"
        leftItem={
          <Button as={NextLink} href={pagesPath.trainings.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default TrainingPage;

type Props = {
  id: string;
  goToTrainingsPage: () => void;
};
const Training: FC<Props> = (props) => {
  const util = trpc.useContext();
  const trainingQuery = trpc.training.getById.useQuery({ id: props.id });
  const deleteTrainingMutation = trpc.training.deleteTraining.useMutation({
    onSuccess: () => {
      util.training.invalidate();
      props.goToTrainingsPage();
    },
  });
  const deleteTraining = useCallback<ViewProps["deleteTraining"]>(() => {
    deleteTrainingMutation.mutate({
      id: props.id,
    });
  }, [deleteTrainingMutation, props.id]);

  switch (trainingQuery.status) {
    case "loading":
      // TODO
      return <p>トレーニングデータを取得中</p>;
    case "error":
      // TODO
      return <p>トレーニングデータの取得に失敗しました</p>;
  }

  return (
    <TrainingView
      UpdateTrainingForm={<UpdateTrainingForm training={trainingQuery.data} />}
      deleteTraining={deleteTraining}
      deleteTrainingStatus={deleteTrainingMutation.status}
    />
  );
};

type ViewProps = {
  UpdateTrainingForm: JSX.Element;
  deleteTraining: () => void;
  deleteTrainingStatus: MutationState;
};
const TrainingView: FC<ViewProps> = (props) => {
  const onClickDelete = useCallback<MouseEventHandler>(
    (_) => {
      props.deleteTraining();
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        {props.UpdateTrainingForm}
        <Button
          onClick={onClickDelete}
          isLoading={props.deleteTrainingStatus === "loading"}
          isDisabled={props.deleteTrainingStatus === "loading"}
        >
          トレーニング記録を削除
        </Button>
      </Stack>
    </Container>
  );
};
