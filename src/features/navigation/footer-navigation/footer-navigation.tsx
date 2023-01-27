import { Box, Button, Container, Grid, GridItem } from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";

import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const FooterNavigation: FC<Props> = (props) => {
  return <FooterNavigationView>{props.children}</FooterNavigationView>;
};

type ViewProps = {
  children: ReactNode;
};
export const FooterNavigationView: FC<ViewProps> = (props) => {
  return (
    <Box mb="16">
      <Box
        as="footer"
        position="fixed"
        bottom="0"
        zIndex="docked"
        width="full"
        height="16"
        alignContent="center"
      >
        <Container height="full">
          <Grid
            templateColumns="1fr 1fr 1fr"
            as="nav"
            bg="white"
            height="full"
            alignItems="center"
          >
            <GridItem>
              <Button w="full" disabled>
                テンプレート
              </Button>
            </GridItem>
            <GridItem>
              <Button as={NextLink} href={pagesPath.trainings.$url()} w="full">
                トレーニング
              </Button>
            </GridItem>
            <GridItem>
              <Button as={NextLink} href={pagesPath.settings.$url()} w="full">
                設定
              </Button>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      {props.children}
    </Box>
  );
};
