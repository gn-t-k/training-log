import { Card, CardBody, List, Text, UnorderedList } from "@chakra-ui/react";
import { FC, MouseEventHandler } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import { Muscle } from "../muscle";

type Props = {
  onClickHOF: (muscle: Muscle) => MouseEventHandler;
};
export const MuscleList: FC<Props> = ({ onClickHOF }) => {
  const musclesQuery = trpc.muscle.getAll.useQuery();

  switch (musclesQuery.status) {
    case "loading":
      // TODO
      return <p>部位データを取得中</p>;
    case "success": {
      const muscles = musclesQuery.data;

      return <MuscleListView {...{ muscles, onClickHOF }} />;
    }
    case "error":
      // TODO
      return <p>部位データの取得に失敗しました</p>;
  }
};

type ViewProps = {
  muscles: Muscle[];
  onClickHOF: Props["onClickHOF"];
};
export const MuscleListView: FC<ViewProps> = ({ muscles, onClickHOF }) => {
  return (
    <UnorderedList>
      {muscles.map((muscle) => {
        const onClick = onClickHOF(muscle);
        return (
          <List key={muscle.id} mb={4}>
            <Card {...{ onClick }}>
              <CardBody>
                <Text>{muscle.name}</Text>
              </CardBody>
            </Card>
          </List>
        );
      })}
    </UnorderedList>
  );
};
