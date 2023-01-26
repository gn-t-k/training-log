import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  List,
  Spacer,
  Spinner,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import type { Muscle } from "../muscle";
import type { FC } from "react";

export const MuscleList: FC = () => {
  const musclesQuery = trpc.muscle.getAll.useQuery();

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "success": {
      const muscles = musclesQuery.data;

      return (
        <MuscleListView
          muscles={muscles}
          isFetching={musclesQuery.isFetching}
        />
      );
    }
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  muscles: Muscle[];
  isFetching: boolean;
};
export const MuscleListView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column">
      {props.isFetching && <Spinner />}
      <UnorderedList>
        {props.muscles.map((muscle) => {
          return (
            <List key={muscle.id} mb={4}>
              <Stack direction="column">
                <Stack direction="row">
                  <Text>{muscle.name}</Text>
                  <Spacer />
                  <Button
                    as={NextLink}
                    href={pagesPath.muscles._id(muscle.id).$url()}
                  >
                    <ChevronRightIcon />
                  </Button>
                </Stack>
                <Divider />
              </Stack>
            </List>
          );
        })}
      </UnorderedList>
    </Stack>
  );
};
