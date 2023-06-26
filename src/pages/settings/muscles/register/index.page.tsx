import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { pagesPath } from "@/libs/pathpida/$path";

import type { NextPageWithLayout } from "@/pages/_app.page";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { RegisterMuscleForm } from "@/features/muscle/register-muscle-form/register-muscle-form";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/features/navigation/header-navigation/header-navigation";

import type { FC, ReactElement } from "react";

const RegisterMusclePage: NextPageWithLayout = () => {
  const router = useRouter();
  const goToMusclesPage: Props["goToMusclesPage"] = () => {
    router.push(pagesPath.settings.muscles.$url());
  };

  return (
    <>
      <Head>
        <title>部位を登録する | training-log</title>
      </Head>
      <RequireLogin>
        <RegisterMuscle goToMusclesPage={goToMusclesPage} />
      </RequireLogin>
    </>
  );
};
RegisterMusclePage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="部位を登録する"
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
export default RegisterMusclePage;

type Props = {
  goToMusclesPage: () => void;
};
const RegisterMuscle: FC<Props> = () => {
  return <RegisterMuscleView RegisterMuscleFrom={<RegisterMuscleForm />} />;
};

type ViewProps = {
  RegisterMuscleFrom: JSX.Element;
};
const RegisterMuscleView: FC<ViewProps> = (props) => {
  return <Container>{props.RegisterMuscleFrom}</Container>;
};
