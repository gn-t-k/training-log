import { Box, Button, Container, Grid, GridItem } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { pagesPath } from "@/libs/pathpida/$path";

import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const FooterNavigation: FC<Props> = (props) => {
  const path = useRouter().asPath.split("/");
  const current = path[1] ?? "";

  return (
    <FooterNavigationView current={current}>
      {props.children}
    </FooterNavigationView>
  );
};

type ViewProps = {
  children: ReactNode;
  current: string;
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
            templateColumns="1fr 1fr"
            as="nav"
            bg="white"
            height="full"
            alignItems="center"
          >
            <GridItem>
              <Button
                as={NextLink}
                href={pagesPath.trainings.$url()}
                w="full"
                fontWeight={props.current === "trainings" ? "bold" : "normal"}
              >
                トレーニング
              </Button>
            </GridItem>
            <GridItem>
              <Button
                as={NextLink}
                href={pagesPath.settings.$url()}
                w="full"
                fontWeight={props.current === "settings" ? "bold" : "normal"}
              >
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
