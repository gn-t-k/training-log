import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack, useToast } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { NextPageWithLayout } from "@/pages/_app.page";

import type { MutationState } from "@/utils/mutation-state";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { UpdateMuscleForm } from "@/features/muscle/update-muscle-form/update-muscle-form";
import { useGetMuscleId } from "@/features/muscle/use-get-muscle-id";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";
import { Redirect } from "@/features/navigation/redirect/redirect";

import type { FC, MouseEventHandler, ReactElement } from "react";

const MusclePage: NextPageWithLayout = () => {
  const id = useGetMuscleId();
  const router = useRouter();

  const goToMusclesPage = useCallback<Props["goToMusclesPage"]>(() => {
    router.push(pagesPath.settings.muscles.$url());
  }, [router]);

  if (id === null) {
    return <Redirect redirectTo={pagesPath.settings.muscles.$url()} />;
  }

  return (
    <>
      <Head>
        <title>部位を編集する | training-log</title>
      </Head>
      <RequireLogin>
        <Muscle id={id} goToMusclesPage={goToMusclesPage} />
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
  goToMusclesPage: () => void;
};
const Muscle: FC<Props> = (props) => {
  const util = trpc.useContext();
  const muscleQuery = trpc.muscle.getById.useQuery({ id: props.id });
  const deleteMuscleMutation = trpc.muscle.delete.useMutation({
    onSuccess: () => {
      util.muscle.invalidate();
      props.goToMusclesPage();
    },
  });
  const deleteMuscle = useCallback<ViewProps["deleteMuscle"]>(() => {
    deleteMuscleMutation.mutate({
      id: props.id,
    });
  }, [deleteMuscleMutation, props.id]);

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
      deleteMuscle={deleteMuscle}
      deleteMuscleStatus={deleteMuscleMutation.status}
      UpdateMuscleForm={<UpdateMuscleForm muscle={muscleQuery.data} />}
    />
  );
};

type ViewProps = {
  deleteMuscle: () => void;
  deleteMuscleStatus: MutationState;
  UpdateMuscleForm: JSX.Element;
};
const MuscleView: FC<ViewProps> = (props) => {
  const toast = useToast();

  useEffect(() => {
    switch (props.deleteMuscleStatus) {
      case "success":
        toast({
          title: "部位を削除しました",
          status: "success",
        });
        return;
      case "error":
        toast({
          title: "部位の削除に失敗しました",
          status: "error",
        });
        return;
    }
  }, [props.deleteMuscleStatus, toast]);

  const onClickDelete = useCallback<MouseEventHandler>(() => {
    props.deleteMuscle();
  }, [props]);

  return (
    <Container>
      <Stack direction="column">
        {props.UpdateMuscleForm}
        <Button
          onClick={onClickDelete}
          isLoading={props.deleteMuscleStatus === "loading"}
          isDisabled={props.deleteMuscleStatus === "loading"}
        >
          種目を削除
        </Button>
      </Stack>
    </Container>
  );
};
