import { addDays, getDay, getMonth, subDays } from "date-fns";

import type { Month } from "@/utils/date";

import { TrainingCalendarWeekView } from "../training-calendar-week/training-calendar-week";
import { WeeklyTrainingPickerView } from "./weekly-training-picker";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof WeeklyTrainingPickerView>;
type Props = ComponentProps<typeof WeeklyTrainingPickerView>;
type Story = ComponentStoryObj<typeof WeeklyTrainingPickerView>;

const componentMeta: Meta = {
  component: WeeklyTrainingPickerView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const today = new Date();

  const selected = addDays(today, 2);
  const start = subDays(selected, getDay(selected));
  const month = getMonth(selected) as Month;
  const trainingDates = [subDays(selected, 1), addDays(selected, 1)];

  const args: Props = {
    selected: props.selected ?? selected,
    TrainingCalendarWeek: (
      <TrainingCalendarWeekView
        start={start}
        today={today}
        month={month}
        selected={selected}
        trainingDates={trainingDates}
      />
    ),
  };

  return <WeeklyTrainingPickerView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
