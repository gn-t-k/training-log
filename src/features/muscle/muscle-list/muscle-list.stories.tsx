import { MuscleListView } from "./muscle-list";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

type Meta = ComponentMeta<typeof MuscleListView>;
type Props = ComponentProps<typeof MuscleListView>;
type Story = ComponentStoryObj<typeof MuscleListView>;

const componentMeta: Meta = {
  component: MuscleListView,
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
      isFetching: props.isFetching ?? false,
    };

    return <MuscleListView {...args} />;
  },
};

export const Default: Story = {
  ...Template,
};
