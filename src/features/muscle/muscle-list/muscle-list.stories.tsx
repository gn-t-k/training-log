import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps, MouseEventHandler } from "react";

import { Muscle } from "../muscle";
import { MuscleListView } from "./muscle-list";

type Meta = ComponentMeta<typeof MuscleListView>;
type Props = ComponentProps<typeof MuscleListView>;
type Story = ComponentStoryObj<typeof MuscleListView>;

const componentMeta: Meta = {
  component: MuscleListView,
};
export default componentMeta;

const Template: Story = {
  render: (props: Partial<Props>) => {
    const dummyOnClickHOF =
      (muscle: Muscle): MouseEventHandler =>
      (event) => {
        action("onClick")({ muscle, event });
      };
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
      onClickHOF: props.onClickHOF ?? dummyOnClickHOF,
    };

    return <MuscleListView {...args} />;
  },
};

export const Default: Story = {
  ...Template,
};
