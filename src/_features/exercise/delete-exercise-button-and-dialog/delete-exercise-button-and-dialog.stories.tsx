import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { DeleteExerciseButtonAndDialogView } from "./delete-exercise-button-and-dialog";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof DeleteExerciseButtonAndDialogView>;
type Props = ComponentProps<typeof DeleteExerciseButtonAndDialogView>;
type Story = ComponentStoryObj<typeof DeleteExerciseButtonAndDialogView>;

const componentMeta: Meta = {
  component: DeleteExerciseButtonAndDialogView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [deleteExerciseStatus, setDeleteExerciseStatus] =
    useState<MutationState>("idle");
  const deleteExercise: Props["deleteExercise"] = () => {
    void (async (): Promise<void> => {
      setDeleteExerciseStatus("loading");
      await sleep(1000);
      action("delete exercise")();
      setDeleteExerciseStatus("success");
    })();
  };
  const args: Props = {
    exercise: {
      id: "id-e-1",
      name: "アームカール",
      targets: [
        {
          id: "id-m-1",
          name: "上腕二頭筋",
        },
      ],
    },
    deleteExercise: props.deleteExercise ?? deleteExercise,
    deleteExerciseStatus: props.deleteExerciseStatus ?? deleteExerciseStatus,
  };

  return <DeleteExerciseButtonAndDialogView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
