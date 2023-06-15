import { AddIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/_libs/pathpida/$path";

import type { FC } from "react";

// TODO: 日付の初期値を設定したい
export const RegisterTrainingButton: FC = () => {
  return <RegisterTrainingButtonView />;
};

export const RegisterTrainingButtonView: FC = () => {
  return (
    <Button
      as={NextLink}
      // href={pagesPath.trainings.register.$url()}
      href={pagesPath.$url()}
      position="fixed"
      bottom={24}
      right={4}
      zIndex="docked"
      height={12}
      width={12}
      borderRadius="50%"
      color="white"
      backgroundColor="teal"
    >
      <AddIcon />
    </Button>
  );
};
