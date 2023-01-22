import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";

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
    const dummyGoToMusclePage: Props["goToMusclePage"] = (id) => {
      action("go to muscle page")(id);
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
      goToMusclePage: props.goToMusclePage ?? dummyGoToMusclePage,
      isFetching: props.isFetching ?? false,
    };

    return <MuscleListView {...args} />;
  },
};

export const Default: Story = {
  ...Template,
};
