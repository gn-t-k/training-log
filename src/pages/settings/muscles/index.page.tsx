import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";
import { FooterNavigation } from "@/features/navigation/footer-navigation/footer-navigation";

import type { NextPageWithLayout } from "../../_app.page";
import type { FC, ReactElement } from "react";

const MusclesPage: NextPageWithLayout = () => {
  return (
    <RequireLogin>
      <Head>
        <title>部位 | training-log</title>
      </Head>
      <Muscles />
    </RequireLogin>
  );
};
MusclesPage.getLayout = (page): ReactElement => {
  return <FooterNavigation>{page}</FooterNavigation>;
};
export default MusclesPage;

const Muscles: FC = () => {
  return <MusclesView MuscleList={<MuscleList />} />;
};

type ViewProps = {
  MuscleList: JSX.Element;
};
const MusclesView: FC<ViewProps> = (props) => {
  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button as={NextLink} href={pagesPath.settings.$url()}>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
          <Heading>部位</Heading>
          <Spacer />
          <Button
            as={NextLink}
            href={pagesPath.settings.muscles.register.$url()}
          >
            <AddIcon />
          </Button>
        </Stack>
        {props.MuscleList}
      </Stack>
    </Container>
  );
};
