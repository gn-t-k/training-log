import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";



import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { DeleteMuscleButtonAndDialog } from "@/_features/muscle/delete-muscle-button-and-dialog/delete-muscle-button-and-dialog";
import { UpdateMuscleForm } from "@/_features/muscle/update-muscle-form/update-muscle-form";
import { useGetMuscleId } from "@/_features/muscle/use-get-muscle-id";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";

import type { NextPageWithLayout } from "@/_pages/_app.page";
import type { FC, ReactElement } from "react";

const MusclePage: NextPageWithLayout = () => {
  const id = useGetMuscleId();

  if (id === null) {
    // return <Redirect redirectTo={pagesPath.settings.muscles.$url()} />;
    return <Redirect redirectTo={pagesPath.$url()} />;
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
          // <Button as={NextLink} href={pagesPath.settings.muscles.$url()}>
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
export default MusclePage;

type Props = {
  id: string;
};
const Muscle: FC<Props> = (props) => {
  const muscleQuery = trpc.muscle.getById.useQuery({ id: props.id });

  switch (muscleQuery.status) {
    case "loading":
      return <Loading description="部位データを取得しています" />;
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
