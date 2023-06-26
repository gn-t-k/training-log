import { ExerciseListView } from "./exercise-list";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof ExerciseListView>;
type Props = ComponentProps<typeof ExerciseListView>;
type Story = ComponentStoryObj<typeof ExerciseListView>;

const componentMeta: Meta = {
  component: ExerciseListView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
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
  };

  return <ExerciseListView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
