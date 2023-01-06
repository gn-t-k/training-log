import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";

import { MuscleList } from "./muscle-list";

type Meta = ComponentMeta<typeof MuscleList>;
type Props = ComponentProps<typeof MuscleList>;
type Story = ComponentStoryObj<typeof MuscleList>;

const componentMeta: Meta = {
  component: MuscleList,
};
export default componentMeta;

const Template: Story = {
  render: (props: Partial<Props>) => {
    const args: Props = {
      muscles: props.muscles ?? [
        {
          id: "id1",
          name: "大胸筋",
        },
        {
          id: "id2",
          name: "上腕三頭筋",
        },
      ],
    };

    return <MuscleList {...args} />;
  },
};

export const Default: Story = {
  ...Template,
};
