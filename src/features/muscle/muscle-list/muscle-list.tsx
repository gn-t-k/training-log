import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Heading, Spacer, Stack, StackDivider } from "@chakra-ui/react";
import NextLink from "next/link";

import { pagesPath } from "@/libs/pathpida/$path";
import { trpc } from "@/libs/trpc/client/trpc";

import { Loading } from "@/ui/loading/loading";

import type { Muscle } from "../muscle";
import type { FC } from "react";

export const MuscleList: FC = () => {
  const musclesQuery = trpc.muscle.getAll.useQuery();

  switch (musclesQuery.status) {
    case "loading":
      return <Loading description="部位データを取得しています" />;
    case "success": {
      const muscles = musclesQuery.data;

      return <MuscleListView muscles={muscles} />;
    }
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  muscles: Muscle[];
};
export const MuscleListView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column" divider={<StackDivider />} spacing={4}>
      {props.muscles.map((muscle) => {
        return (
          <Stack key={muscle.id} direction="row">
            <Heading size="sm">{muscle.name}</Heading>
            <Spacer />
            <Button
              as={NextLink}
              href={pagesPath.settings.muscles._id(muscle.id).$url()}
            >
              <ChevronRightIcon />
            </Button>
          </Stack>
        );
      })}
    </Stack>
  );
};
