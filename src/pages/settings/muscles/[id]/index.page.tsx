import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { DeleteMuscleButtonAndDialog } from "@/features/muscle/delete-muscle-button-and-dialog/delete-muscle-button-and-dialog";
import { UpdateMuscleForm } from "@/features/muscle/update-muscle-form/update-muscle-form";
import { useGetMuscleId } from "@/features/muscle/use-get-muscle-id";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { FC, ReactElement } from "react";

const MusclePage: NextPageWithLayout = () => {
  const id = useGetMuscleId();

  if (id === null) {
    return <Redirect redirectTo={pagesPath.settings.muscles.$url()} />;
  }

  return (
    <>
      <Head>
        <title>部位を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <Muscle id={id} />
      </RequireLogin>
    </>
  );
};
MusclePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="部位を編集する"
        leftItem={
          <Button as={NextLink} href={pagesPath.settings.muscles.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default MusclePage;

type Props = {
  id: string;
};
const Muscle: FC<Props> = (props) => {
  const muscleQuery = trpc.muscle.getById.useQuery({ id: props.id });

  switch (muscleQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }

  return (
    <MuscleView
      DeleteMuscleButtonAndDialog={
        <DeleteMuscleButtonAndDialog muscle={muscleQuery.data} />
      }
      UpdateMuscleForm={<UpdateMuscleForm muscle={muscleQuery.data} />}
    />
  );
};

type ViewProps = {
  UpdateMuscleForm: JSX.Element;
  DeleteMuscleButtonAndDialog: JSX.Element;
};
const MuscleView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        {props.UpdateMuscleForm}
        {props.DeleteMuscleButtonAndDialog}
      </Stack>
    </Container>
  );
};
