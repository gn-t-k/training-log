import { WeeklyNumberOfSetsItemView } from "../weekly-number-of-sets-item/weekly-number-of-sets-item";
import { WeeklyNumberOfSetsListView } from "./weekly-number-of-sets-list";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof WeeklyNumberOfSetsListView>;
type Props = ComponentProps<typeof WeeklyNumberOfSetsListView>;
type Story = ComponentStoryObj<typeof WeeklyNumberOfSetsListView>;

const componentMeta: Meta = {
  component: WeeklyNumberOfSetsListView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const WeeklyNumberOfSetsItem: Props["WeeklyNumberOfSetsItem"] = (props) => {
    return (
      <WeeklyNumberOfSetsItemView
        muscleName={props.muscle.name}
        weeklyNumberOfSets={2}
      />
    );
  };
  const args: Props = {
    start: props.start ?? new Date(),
    muscles: props.muscles ?? [
      {
        id: "id-m-1",
        name: "大胸筋",
      },
      {
        id: "id-m-2",
        name: "広背筋",
      },
    ],
    WeeklyNumberOfSetsItem:
      props.WeeklyNumberOfSetsItem ?? WeeklyNumberOfSetsItem,
  };

  return <WeeklyNumberOfSetsListView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
