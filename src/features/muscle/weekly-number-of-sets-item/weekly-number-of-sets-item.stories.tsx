import { WeeklyNumberOfSetsItemView } from "./weekly-number-of-sets-item";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof WeeklyNumberOfSetsItemView>;
type Props = ComponentProps<typeof WeeklyNumberOfSetsItemView>;
type Story = ComponentStoryObj<typeof WeeklyNumberOfSetsItemView>;

const componentMeta: Meta = {
  component: WeeklyNumberOfSetsItemView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    muscleName: props.muscleName ?? "大胸筋",
    weeklyNumberOfSets: props.weeklyNumberOfSets ?? 2,
  };

  return <WeeklyNumberOfSetsItemView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
