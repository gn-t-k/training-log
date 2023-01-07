import { Stack, useToast } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FC, MouseEventHandler, useEffect } from "react";
import { z } from "zod";

import { RequireLogin } from "@/features/auth/require-login/require-login";
import { Muscle } from "@/features/muscle/muscle";
import { MuscleList } from "@/features/muscle/muscle-list/muscle-list";
import { RegisterMuscleForm } from "@/features/muscle/register-muscle-form/register-muscle-form";

const MusclesContainer: NextPage = () => {
  return (
    <RequireLogin>
      <Muscles />
    </RequireLogin>
  );
};
export default MusclesContainer;

const querySchema = z.object({
  id: z.string(),
});
type Query = z.infer<typeof querySchema>;

const Muscles: FC = () => {
  const router = useRouter();
  const toast = useToast();
  const query = ((): Query | null => {
    const maybeQuery = querySchema.safeParse(router.query);

    return maybeQuery.success ? maybeQuery.data : null;
  })();

  useEffect(() => {
    if (query !== null) {
      console.log({ id: query.id });
    }
  }, [query]);

  const onClickHOF =
    (muscle: Muscle): MouseEventHandler =>
    (e) => {
      e.preventDefault();

      toast({
        title: muscle.name,
      });
    };

  return (
    <Stack p={8}>
      <RegisterMuscleForm />
      <MuscleList {...{ onClickHOF }} />
    </Stack>
  );
};
