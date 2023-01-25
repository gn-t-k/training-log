import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Heading, Spacer, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { pagesPath } from "@/libs/pathpida/$path";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";

import type { NextPage } from "next";
import type { FC, MouseEventHandler} from "react";

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
  return (
    <MusclesView
      goToTopPage={props.goToTopPage}
      goToRegisterPage={props.goToRegisterPage}
      MuscleList={<MuscleList goToMusclePage={props.goToMusclePage} />}
    />
  );
};

type ViewProps = {
  goToTopPage: () => void;
  goToRegisterPage: () => void;
  MuscleList: JSX.Element;
};
const MusclesView: FC<ViewProps> = (props) => {
  const onClickBack = useCallback<MouseEventHandler>(
    (_) => {
      props.goToTopPage();
    },
    [props]
  );
  const onClickAdd = useCallback<MouseEventHandler>(
    (_) => {
      props.goToRegisterPage();
    },
    [props]
  );

  return (
    <Container>
      <Stack direction="column">
        <Stack direction="row">
          <Button onClick={onClickBack}>
            <ChevronLeftIcon />
          </Button>
          <Spacer />
          <Heading>部位</Heading>
          <Spacer />
          <Button onClick={onClickAdd}>
            <AddIcon />
          </Button>
        </Stack>
        {props.MuscleList}
      </Stack>
    </Container>
  );
};
