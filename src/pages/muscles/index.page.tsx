import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";

const MusclesPage: NextPage = () => {
  const router = useRouter();
  const goToTopPage: Props["goToTopPage"] = () => {
    router.push(pagesPath.$url());
  };
  const goToMusclePage: Props["goToMusclePage"] = (id) => {
    router.push(pagesPath.muscles._id(id).$url());
  };
  const goToRegisterPage: Props["goToRegisterPage"] = () => {
    router.push(pagesPath.muscles.register.$url());
  };

  return (
    <RequireLogin>
      <Muscles
        goToTopPage={goToTopPage}
        goToMusclePage={goToMusclePage}
        goToRegisterPage={goToRegisterPage}
      />
    </RequireLogin>
  );
};
export default MusclesPage;

type Props = {
  goToTopPage: () => void;
  goToMusclePage: (id: string) => void;
  goToRegisterPage: () => void;
};
const Muscles: FC<Props> = (props) => {
  const onClickAdd: MouseEventHandler = (e) => {
    e.preventDefault();

    props.goToRegisterPage();
  };
  const goToTopPage: MouseEventHandler = (e) => {
    e.preventDefault();

    props.goToTopPage();
  };

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={goToTopPage}>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
          <Heading>部位</Heading>
          <Spacer />
          <Button onClick={onClickAdd}>
            <AddIcon />
          </Button>
        </Stack>
        <MuscleList goToMusclePage={props.goToMusclePage} />
      </Stack>
    </Container>
  );
};
