import { EditTrainingButtonAndModalView } from "./edit-training-button-and-modal";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof EditTrainingButtonAndModalView>;
type Props = ComponentProps<typeof EditTrainingButtonAndModalView>;
type Story = ComponentStoryObj<typeof EditTrainingButtonAndModalView>;

const componentMeta: Meta = {
  component: EditTrainingButtonAndModalView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
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
  };

  return <EditTrainingButtonAndModalView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
