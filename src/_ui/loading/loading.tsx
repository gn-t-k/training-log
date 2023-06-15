import { Center, Text, Flex, Spinner } from "@chakra-ui/react";

import type { FC } from "react";

type LoadingProps = {
  full?: boolean;
  description?: string;
};
export const Loading: FC<LoadingProps> = (props) =>
  props.full ? (
    <Center h={"100vh"}>
      <LoadingContent description={props.description} />
    </Center>
  ) : (
    <LoadingContent description={props.description} />
  );

type LoadingContentProps = {
  description?: string;
};
const LoadingContent: FC<LoadingContentProps> = (props) => (
  <Flex
    align={"center"}
    justify={"center"}
    width={"full"}
    height={"full"}
    direction={"column"}
    gap={"8"}
    p={"10"}
  >
    <Spinner size={"lg"} />
    {props.description && <Text>{props.description}</Text>}
  </Flex>
);
