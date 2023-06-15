import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { RegisterMuscleForm } from "@/_features/muscle/register-muscle-form/register-muscle-form";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { pagesPath } from "@/_libs/pathpida/$path";

import type { NextPageWithLayout } from "@/_pages/_app.page";
import type { FC, ReactElement } from "react";

const RegisterMusclePage: NextPageWithLayout = () => {
  const router = useRouter();
  const goToMusclesPage: Props["goToMusclesPage"] = async () => {
    // router.push(pagesPath.settings.muscles.$url());
    await router.push(pagesPath.$url());
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
