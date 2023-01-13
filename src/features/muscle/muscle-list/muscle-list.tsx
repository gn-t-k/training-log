import { EditIcon } from "@chakra-ui/icons";
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
import { FC, MouseEventHandler } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Muscle } from "../muscle";

type Props = {
  onClickEditHOF: (muscle: Muscle) => MouseEventHandler;
};
export const MuscleList: FC<Props> = ({ onClickEditHOF }) => {
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
          onClickEditHOF={onClickEditHOF}
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
  onClickEditHOF: Props["onClickEditHOF"];
  isFetching: boolean;
};
export const MuscleListView: FC<ViewProps> = ({
  muscles,
  onClickEditHOF,
  isFetching,
}) => {
  return (
    <Stack direction="column">
      {isFetching && <Spinner />}
      <UnorderedList>
        {muscles.map((muscle) => {
          const onClick = onClickEditHOF(muscle);
          return (
            <List key={muscle.id} mb={4}>
              <Stack direction="column">
                <Stack direction="row">
                  <Text>{muscle.name}</Text>
                  <Spacer />
                  <Button {...{ onClick }}>
                    <EditIcon />
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
