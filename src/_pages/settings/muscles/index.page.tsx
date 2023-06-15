import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";


import { RequireLogin } from "@/_features/auth/require-login/require-login";
import { MuscleList } from "@/_features/muscle/muscle-list/muscle-list";
import { FooterNavigation } from "@/_features/navigation/footer-navigation/footer-navigation";
import { HeaderNavigation } from "@/_features/navigation/header-navigation/header-navigation";
import { pagesPath } from "@/_libs/pathpida/$path";

import type { NextPageWithLayout } from "../../_app.page";
import type { FC, ReactElement } from "react";

const MusclesPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>部位 | training-log</title>
      </Head>
      <RequireLogin>
        <Muscles />
      </RequireLogin>
    </>
  );
};
MusclesPage.getLayout = (page): ReactElement => {
  return (
    <FooterNavigation>
      <HeaderNavigation
        title="部位"
        leftItem={
          // <Button as={NextLink} href={pagesPath.settings.$url()}>
          <Button as={NextLink} href={pagesPath.$url()}>
            <ChevronLeftIcon />
          </Button>
        }
        rightItem={
          <Button
            as={NextLink}
            // href={pagesPath.settings.muscles.register.$url()}
            href={pagesPath.$url()}
          >
            <AddIcon />
          </Button>
        }
      >
        {page}
      </HeaderNavigation>
    </FooterNavigation>
  );
};
export default MusclesPage;

const Muscles: FC = () => {
  return <MusclesView MuscleList={<MuscleList />} />;
};

type ViewProps = {
  MuscleList: JSX.Element;
};
const MusclesView: FC<ViewProps> = (props) => {
  return <Container>{props.MuscleList}</Container>;
};
