import { List, Text, UnorderedList } from "@chakra-ui/react";
import { FC } from "react";

import { Muscle } from "../muscle";

type Props = {
  muscles: Muscle[];
};
export const MuscleList: FC<Props> = ({ muscles }) => {
  return (
    <UnorderedList>
      {muscles.map((muscle) => (
        <List key={muscle.id}>
          <Text>{muscle.id}</Text>
          <Text>{muscle.name}</Text>
        </List>
      ))}
    </UnorderedList>
  );
};
