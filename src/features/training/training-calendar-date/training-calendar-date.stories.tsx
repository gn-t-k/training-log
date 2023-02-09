import { TrainingCalendarDateView } from "./training-calendar-date";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof TrainingCalendarDateView>;
type Props = ComponentProps<typeof TrainingCalendarDateView>;
type Story = ComponentStoryObj<typeof TrainingCalendarDateView>;

const componentMeta: Meta = {
  component: TrainingCalendarDateView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const date = new Date();
  const args: Props = {
    date: props.date ?? date,
    isToday: props.isToday ?? false,
    isThisMonth: props.isThisMonth ?? true,
    isTrainingExist: props.isTrainingExist ?? false,
    isSelected: props.isSelected ?? false,
  };

  return <TrainingCalendarDateView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
