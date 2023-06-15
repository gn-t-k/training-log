import { addDays, getDay, getMonth, subDays } from "date-fns";

import { WeeklyTrainingPickerView } from "./weekly-training-picker";
import { MonthlyTrainingPickerView } from "../monthly-training-picker/monthly-training-picker";
import { useMonthlyCalendar } from "../monthly-training-picker/use-monthly-calendar";
import { TrainingCalendarMonthView } from "../training-calendar-month/training-calendar-month";
import { TrainingCalendarWeekView } from "../training-calendar-week/training-calendar-week";

import type { Month } from "@/_utils/date";
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
    TrainingCalendarWeek: props.TrainingCalendarWeek ?? (
      <TrainingCalendarWeekView
        start={start}
        today={today}
        month={month}
        selected={selected}
        trainingDates={trainingDates}
      />
    ),
    MonthlyTrainingPicker: props.MonthlyTrainingPicker ?? (
      <MockMonthlyTrainingPicker
        today={today}
        selected={selected}
        trainingDates={trainingDates}
      />
    ),
  };

  return <WeeklyTrainingPickerView {...args} />;
};

type MockMonthlyTrainingPicker = {
  today: Date;
  selected: Date;
  trainingDates: Date[];
};
const MockMonthlyTrainingPicker: FC<MockMonthlyTrainingPicker> = (props) => {
  const [{ year, month }, { next, prev }] = useMonthlyCalendar({
    today: props.today,
    selected: props.selected,
  });

  return (
    <MonthlyTrainingPickerView
      today={props.today}
      TrainingCalendarMonth={
        <TrainingCalendarMonthView
          year={year}
          month={month}
          today={props.today}
          selected={props.selected}
          trainingDates={props.trainingDates}
        />
      }
      year={year}
      month={month}
      next={next}
      prev={prev}
    />
  );
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
