import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps, FC } from "react";

import { ExerciseView } from "./index.page";

type Meta = ComponentMeta<typeof ExerciseView>;
type Props = ComponentProps<typeof ExerciseView>;
type Story = ComponentStoryObj<typeof ExerciseView>;

const componentMeta: Meta = {
  component: ExerciseView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const dummyUpdateExercise: Props["updateExercise"] = (exercise) => {
    action("update exercise")(exercise);
  };
  const dummyDeleteExercise: Props["deleteExercise"] = (id) => {
    action("delete exercise")(id);
  };
  const args: Props = {
    exercise: props.exercise ?? {
      id: "id-e-1",
      name: "ベンチプレス",
      targets: [
        {
          id: "id-m-1",
          name: "大胸筋",
        },
        {
          id: "id-m-2",
          name: "上腕三頭筋",
        },
      ],
    },
    targets: props.targets ?? [
      {
        id: "id-m-1",
        name: "大胸筋",
      },
      {
        id: "id-m-2",
        name: "上腕三頭筋",
      },
      {
        id: "id-m-3",
        name: "三角筋前部",
      },
    ],
    updateExercise: props.updateExercise ?? dummyUpdateExercise,
    deleteExercise: props.deleteExercise ?? dummyDeleteExercise,
  };

  return <ExerciseView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
