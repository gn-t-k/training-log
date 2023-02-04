import { TrainingCalendarView } from "./training-calendar";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof TrainingCalendarView>;
type Props = ComponentProps<typeof TrainingCalendarView>;
type Story = ComponentStoryObj<typeof TrainingCalendarView>;

const componentMeta: Meta = {
  component: TrainingCalendarView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    today: props.today ?? new Date(),
  };

  return <TrainingCalendarView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
