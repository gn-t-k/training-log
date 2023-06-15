import { addDays, getDay, getMonth, subDays } from "date-fns";

import { TrainingCalendarWeekView } from "./training-calendar-week";

import type { Month } from "@/_utils/date";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof TrainingCalendarWeekView>;
type Props = ComponentProps<typeof TrainingCalendarWeekView>;
type Story = ComponentStoryObj<typeof TrainingCalendarWeekView>;

const componentMeta: Meta = {
  component: TrainingCalendarWeekView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const today = new Date();
  const selected = addDays(today, 2);
  const start = subDays(selected, getDay(selected));
  const month = getMonth(selected) as Month;
  const trainingDates = [subDays(selected, 1), addDays(selected, 1)];

  const args: Props = {
    start: props.start ?? start,
    today: props.today ?? today,
    month: props.month ?? month,
    selected: props.selected ?? selected,
    trainingDates: props.trainingDates ?? trainingDates,
  };

  return <TrainingCalendarWeekView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
