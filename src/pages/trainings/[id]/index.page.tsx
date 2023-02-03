import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";
import { DeleteTrainingButtonAndDialog } from "@/features/training/delete-training-button-and-dialog/delete-training-button-and-dialog";
import { UpdateTrainingForm } from "@/features/training/update-training-form/update-training-form";
import { useGetTrainingId } from "@/features/training/use-get-training-id";

import type { FC, ReactElement } from "react";

const TrainingPage: NextPageWithLayout = () => {
  const id = useGetTrainingId();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.trainings.$url()} />;
  }

  return (
    <>
      <Head>
        <title>トレーニング記録を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <Training id={id} />
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
};
const Training: FC<Props> = (props) => {
  const trainingQuery = trpc.training.getById.useQuery({ id: props.id });

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
      DeleteTrainingButtonAndDialog={
        <DeleteTrainingButtonAndDialog training={trainingQuery.data} />
      }
    />
  );
};

type ViewProps = {
  UpdateTrainingForm: JSX.Element;
  DeleteTrainingButtonAndDialog: JSX.Element;
};
const TrainingView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        {props.UpdateTrainingForm}
        {props.DeleteTrainingButtonAndDialog}
      </Stack>
    </Container>
  );
};
