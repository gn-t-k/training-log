import { action } from "@storybook/addon-actions";
import { useState } from "react";

import type { MutationState } from "@/utils/mutation-state";
import { sleep } from "@/utils/sleep";

import { UpdateExerciseFormView } from "./update-exercise-form";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof UpdateExerciseFormView>;
type Props = ComponentProps<typeof UpdateExerciseFormView>;
type Story = ComponentStoryObj<typeof UpdateExerciseFormView>;

const componentMeta: Meta = {
  component: UpdateExerciseFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [updateExerciseStatus, setUpdateExerciseStatus] =
    useState<MutationState>("idle");
  const updateExercise: Props["updateExercise"] = (props) => {
    (async (): Promise<void> => {
      setUpdateExerciseStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setUpdateExerciseStatus("success");
    })();
  };
  const args: Props = {
    updateExercise: props.updateExercise ?? updateExercise,
    updateExerciseStatus: props.updateExerciseStatus ?? updateExerciseStatus,
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
      {
        id: "id-m-4",
        name: "上腕二頭筋",
      },
    ],
    currentExercise: props.currentExercise ?? {
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
        {
          id: "id-m-3",
          name: "三角筋前部",
        },
      ],
    },
    registeredExercises: props.registeredExercises ?? [
      {
        id: "id-e-2",
        name: "アームカール",
        targets: [
          {
            id: "id-m-4",
            name: "上腕二頭筋",
          },
        ],
      },
    ],
  };

  return <UpdateExerciseFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
