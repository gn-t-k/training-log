import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { ExerciseView } from "./index.page";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof ExerciseView>;
type Props = ComponentProps<typeof ExerciseView>;
type Story = ComponentStoryObj<typeof ExerciseView>;

const componentMeta: Meta = {
  component: ExerciseView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [deleteMutationStatus, setDeleteMutationStatus] =
    useState<MutationState>("idle");

  const dummyDeleteExercise: Props["deleteExercise"] = (id) => {
    (async (): Promise<void> => {
      setDeleteMutationStatus("loading");
      await sleep(1000);
      action("delete exercise")(id);
      setDeleteMutationStatus("success");
    })();
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
    deleteExercise: props.deleteExercise ?? dummyDeleteExercise,
    deleteExerciseStatus: props.deleteExerciseStatus ?? deleteMutationStatus,
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
