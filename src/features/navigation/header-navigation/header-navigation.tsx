import { Box, Container, Heading, Spacer, Stack } from "@chakra-ui/react";

import type { FC, ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  leftItem?: JSX.Element;
  rightItem?: JSX.Element;
};
export const HeaderNavigation: FC<Props> = (props) => {
  return (
    <HeaderNavigationView
      title={props.title}
      leftItem={props.leftItem}
      rightItem={props.rightItem}
    >
      {props.children}
    </HeaderNavigationView>
  );
};

type ViewProps = {
  title: string;
  children: ReactNode;
  leftItem?: JSX.Element;
  rightItem?: JSX.Element;
};
export const HeaderNavigationView: FC<ViewProps> = (props) => {
  return (
    <Box mt={16}>
      <Box
        as="header"
        position="fixed"
        top="0"
        zIndex="docked"
        width="full"
        height="16"
        bg="white"
        alignContent="center"
      >
        <Container height="full">
          <Stack direction="row">
            {props.leftItem}
            <Spacer />
            <Heading>{props.title}</Heading>
            <Spacer />
            {props.rightItem}
          </Stack>
        </Container>
      </Box>
      {props.children}
    </Box>
  );
};
