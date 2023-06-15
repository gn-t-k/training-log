import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { UpdateTrainingFormView } from "./update-training-form";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof UpdateTrainingFormView>;
type Props = ComponentProps<typeof UpdateTrainingFormView>;
type Story = ComponentStoryObj<typeof UpdateTrainingFormView>;

const componentMeta: Meta = {
  component: UpdateTrainingFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [updateTrainingStatus, setUpdateTrainingStatus] =
    useState<MutationState>("idle");
  const updateTraining: Props["updateTraining"] = (props) => {
    void (async (): Promise<void> => {
      setUpdateTrainingStatus("loading");
      await sleep(1000);
      action("update exercise")(props);
      setUpdateTrainingStatus("success");
    })();
  };
  const args: Props = {
    training: props.training ?? {
      id: "id-t-1",
      createdAt: new Date(),
      records: [
        {
          id: "id-r-1",
          exercise: {
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
          memo: "重かった",
          sets: [
            {
              id: "id-s-1",
              weight: 80,
              repetition: 10,
            },
            {
              id: "id-s-2",
              weight: 80,
              repetition: 10,
            },
          ],
        },
      ],
    },
    exercises: props.exercises ?? [
      {
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
    updateTraining: props.updateTraining ?? updateTraining,
    updateTrainingStatus: props.updateTrainingStatus ?? updateTrainingStatus,
  };

  return <UpdateTrainingFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
