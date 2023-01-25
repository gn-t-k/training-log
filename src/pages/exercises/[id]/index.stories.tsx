import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { ExerciseView } from "./index.page";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC} from "react";

type Meta = ComponentMeta<typeof ExerciseView>;
type Props = ComponentProps<typeof ExerciseView>;
type Story = ComponentStoryObj<typeof ExerciseView>;

const componentMeta: Meta = {
  component: ExerciseView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [updateMutationStatus, setUpdateMutationStatus] =
    useState<MutationState>("idle");
  const [deleteMutationStatus, setDeleteMutationStatus] =
    useState<MutationState>("idle");

  const dummyUpdateExercise: Props["updateExercise"] = (exercise) => {
    (async (): Promise<void> => {
      setUpdateMutationStatus("loading");
      await sleep(1000);
      action("update exercise")(exercise);
      setUpdateMutationStatus("success");
    })();
  };
  const dummyDeleteExercise: Props["deleteExercise"] = (id) => {
    (async (): Promise<void> => {
      setDeleteMutationStatus("loading");
      await sleep(1000);
      action("delete exercise")(id);
      setDeleteMutationStatus("success");
    })();
  };
  const dummyGoToExercisesPage: Props["goToExercisesPage"] = () => {
    action("go to exercises page")();
  };
  const args: Props = {
    exercise: props.exercise ?? {
      id: "id-e-1",
      name: "ベンチプレス",
      targets: [
        {
          id: "id-m-1",
          name: "大胸筋",
        },
        {
          id: "id-m-2",
          name: "上腕三頭筋",
        },
      ],
    },
    targets: props.targets ?? [
      {
        id: "id-m-1",
        name: "大胸筋",
      },
      {
        id: "id-m-2",
        name: "上腕三頭筋",
      },
      {
        id: "id-m-3",
        name: "三角筋前部",
      },
    ],
    updateExercise: props.updateExercise ?? dummyUpdateExercise,
    deleteExercise: props.deleteExercise ?? dummyDeleteExercise,
    updateExerciseStatus: props.updateExerciseStatus ?? updateMutationStatus,
    deleteExerciseStatus: props.deleteExerciseStatus ?? deleteMutationStatus,
    goToExercisesPage: props.goToExercisesPage ?? dummyGoToExercisesPage,
  };

  return <ExerciseView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
