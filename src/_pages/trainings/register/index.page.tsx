import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { RegisterTrainingForm } from "@/_features/training/register-training-form/register-training-form";
import { pagesPath } from "@/_libs/pathpida/$path";

import type { NextPageWithLayout } from "@/_pages/_app.page";
import type { ComponentProps, FC, ReactElement } from "react";

const RegisterTrainingPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>トレーニングを記録する | training-log</title>
      </Head>
      <RequireLogin>
        <RegisterTraining />
      </RequireLogin>
    </>
  );
};
RegisterTrainingPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="トレーニングを記録する"
        leftItem={
          // <Button as={NextLink} href={pagesPath.trainings.$url()}>
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
export default RegisterTrainingPage;

const RegisterTraining: FC = () => {
  const router = useRouter();
  const exitTrainingForm = useCallback<
    ComponentProps<typeof RegisterTrainingForm>["exitTrainingForm"]
  >(async () => {
    // router.push(pagesPath.trainings.$url());
    await router.push(pagesPath.$url());
  }, [router]);

  return (
    <RegisterTrainingView
      RegisterTrainingForm={
        <RegisterTrainingForm exitTrainingForm={exitTrainingForm} />
      }
    />
  );
};

type ViewProps = {
  RegisterTrainingForm: JSX.Element;
};
const RegisterTrainingView: FC<ViewProps> = (props) => {
  return <Container>{props.RegisterTrainingForm}</Container>;
};
