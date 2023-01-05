import { NextPage } from "next";
import { FC, MouseEventHandler, useEffect } from "react";

import { trpc } from "@/libs/trpc/client/trpc";

import { RequireLogin } from "@/features/auth/require-login/require-login";

const HelloContainer: NextPage = () => {
  return (
    <RequireLogin>
      <Hello />
    </RequireLogin>
  );
};
export default HelloContainer;

const Hello: FC = () => {
  const muscleRegisterMutator = trpc.muscle.register.useMutation();
  const musclesQuery = trpc.muscle.getAll.useQuery();

  useEffect(() => {
    if (muscleRegisterMutator.status === "success") {
      musclesQuery.refetch();
    }
  }, [muscleRegisterMutator.status, musclesQuery]);

  const onClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    muscleRegisterMutator.mutate({ name: `部位${String(new Date())}` });
  };

  if (muscleRegisterMutator.status === "loading") {
    <p>部位を登録中</p>;
  }

  switch (musclesQuery.status) {
    case "loading":
      return <p>部位を取得中</p>;
    case "success": {
      return musclesQuery.data.length === 0 ? (
        <div>
          <button {...{ onClick }}>登録</button>
          <p>まだ部位が登録されていません</p>
        </div>
      ) : (
        <div>
          <button {...{ onClick }}>登録</button>
          <ul>
            {musclesQuery.data.map((muscle) => (
              <li key={muscle.id}>{muscle.name}</li>
            ))}
          </ul>
        </div>
      );
    }
    case "error":
      return <p>部位の取得に失敗しました</p>;
  }
};
