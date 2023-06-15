import { Image, Stack } from "@chakra-ui/react";

import { Redirect } from "@/_features/navigation/redirect/redirect";
import { pagesPath } from "@/_libs/pathpida/$path";
import { trpc } from "@/_libs/trpc/client/trpc";
import { Loading } from "@/_ui/loading/loading";


import type { Trainee } from "../trainee";
import type { FC } from "react";

export const AvatarIconAndName: FC = () => {
  const traineeQuery = trpc.trainee.getBySession.useQuery();

  switch (traineeQuery.status) {
    case "loading":
      return <Loading description="トレーニー情報を取得しています" />;
    case "error":
      // TODO
      return <p>トレーニー情報の取得に失敗しました</p>;
  }

  return traineeQuery.data === null ? (
    // <Redirect redirectTo={pagesPath.onboarding.$url()} />
    <Redirect redirectTo={pagesPath.$url()} />
  ) : (
    <AvatarIconAndNameView trainee={traineeQuery.data} />
  );
};

type ViewProps = {
  trainee: Trainee;
};
export const AvatarIconAndNameView: FC<ViewProps> = (props) => {
  return (
    <Stack direction="column">
      <Image
        src={props.trainee.image}
        alt={props.trainee.name}
        borderRadius="full"
        boxSize="48px"
        alignSelf="center"
      />
      <span>{props.trainee.name}</span>
    </Stack>
  );
};
