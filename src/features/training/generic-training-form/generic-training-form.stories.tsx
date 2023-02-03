import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/utils/sleep";

import { GenericTrainingFormView } from "./generic-training-form";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof GenericTrainingFormView>;
type Props = ComponentProps<typeof GenericTrainingFormView>;
type Story = ComponentStoryObj<typeof GenericTrainingFormView>;

const componentMeta: Meta = {
  component: GenericTrainingFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const onSubmit: Props["onSubmit"] = (props) => {
    (async (): Promise<void> => {
      setIsProcessing(true);
      await sleep(1000);
      action("on submit")(props);
      setIsProcessing(false);
    })();
  };
  const args: Props = {
    defaultValues: props.defaultValues,
    exercises: props.exercises ?? [
      {
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
          {
            id: "id-m-3",
            name: "三角筋前部",
          },
        ],
      },
      {
        id: "id-e-2",
        name: "アームカール",
        targets: [
          {
            id: "id-m-4",
            name: "上腕二頭筋",
          },
        ],
      },
    ],
    onSubmit: props.onSubmit ?? onSubmit,
    isProcessing: props.isProcessing ?? isProcessing,
  };

  return <GenericTrainingFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
