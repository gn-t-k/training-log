import { LatestRecordTextView } from "./latest-record-text";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof LatestRecordTextView>;
type Props = ComponentProps<typeof LatestRecordTextView>;
type Story = ComponentStoryObj<typeof LatestRecordTextView>;

const componentMeta: Meta = {
  component: LatestRecordTextView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    record: props.record ?? {
      id: "id-r-1",
      exercise: {
        id: "id-e-1",
        name: "ベンチプレス",
        targets: [
          {
            id: "id-t-1",
            name: "大胸筋",
          },
          {
            id: "id-t-2",
            name: "上腕三頭筋",
          },
          {
            id: "id-t-3",
            name: "三角筋前部",
          },
        ],
      },
      sets: [
        {
          id: "id-s-1",
          weight: 70,
          repetition: 6,
        },
        {
          id: "id-s-2",
          weight: 70,
          repetition: 6,
        },
        {
          id: "id-s-3",
          weight: 70,
          repetition: 6,
        },
      ],
      memo: "重かった",
    },
  };

  return <LatestRecordTextView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
