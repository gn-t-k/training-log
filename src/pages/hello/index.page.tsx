import { NextPage } from "next";
import { FC, MouseEventHandler } from "react";

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
  const utils = trpc.useContext();
  const musclesQuery = trpc.muscle.getAll.useQuery();
  const muscleRegisterMutator = trpc.muscle.register.useMutation({
    onSuccess: () => {
      utils.muscle.getAll.invalidate();
    },
  });
  const muscleUpdateMutator = trpc.muscle.updateName.useMutation({
    onSuccess: () => {
      utils.muscle.getAll.invalidate();
    },
  });
  const muscleDeleteMutator = trpc.muscle.delete.useMutation({
    onSuccess: () => {
      utils.muscle.getAll.invalidate();
    },
  });

  const isProcessing =
    musclesQuery.isLoading ||
    musclesQuery.isFetching ||
    muscleUpdateMutator.isLoading ||
    muscleDeleteMutator.isLoading;

  const onClickRegister: MouseEventHandler = (e) => {
    e.preventDefault();
    muscleRegisterMutator.mutate({ name: `部位${String(new Date())}` });
  };
  const onClickUpdateHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      muscleUpdateMutator.mutate({ id, name: `部位${String(new Date())}` });
    };
  const onClickDeleteHOF =
    (id: string): MouseEventHandler =>
    (e) => {
      e.preventDefault();
      muscleDeleteMutator.mutate({ id });
    };

  switch (musclesQuery.status) {
    case "loading":
      return <p>部位を取得中</p>;
    case "success": {
      return musclesQuery.data.length === 0 ? (
        <div>
          <button onClick={onClickRegister} disabled={isProcessing}>
            登録
          </button>
          <p>まだ部位が登録されていません</p>
        </div>
      ) : (
        <div>
          <button onClick={onClickRegister} disabled={isProcessing}>
            登録
          </button>
          <ul>
            {musclesQuery.data.map((muscle) => (
              <li key={muscle.id}>
                <p>{muscle.name}</p>
                <button
                  onClick={onClickUpdateHOF(muscle.id)}
                  disabled={isProcessing}
                >
                  更新
                </button>
                <button
                  onClick={onClickDeleteHOF(muscle.id)}
                  disabled={isProcessing}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    case "error":
      return <p>部位の取得に失敗しました</p>;
  }
};
