import { FC } from "react";

import { Muscle } from "../muscle";

type Props = {
  muscles: Muscle[];
};
export const MuscleList: FC<Props> = ({ muscles }) => {
  return (
    <ul>
      {muscles.map((muscle) => (
        <li key={muscle.id}>
          <p>{muscle.id}</p>
          <p>{muscle.name}</p>
        </li>
      ))}
    </ul>
  );
};
