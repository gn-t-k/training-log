import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/utils/sleep";

import { TrainingFormView } from "./training-form";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC} from "react";

type Meta = ComponentMeta<typeof TrainingFormView>;
type Props = ComponentProps<typeof TrainingFormView>;
type Story = ComponentStoryObj<typeof TrainingFormView>;

const componentMeta: Meta = {
  component: TrainingFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const dummyOnSubmit: Props["onSubmit"] = (fieldValue) => {
    (async (): Promise<void> => {
      setIsProcessing(true);
      await sleep(1000);
      action("submit")(fieldValue);
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
        ],
      },
      {
        id: "id-e-2",
        name: "スクワット",
        targets: [
          {
            id: "id-m-2",
            name: "大腿四頭筋",
          },
        ],
      },
    ],
    isProcessing: props.isProcessing ?? isProcessing,
    onSubmit: props.onSubmit ?? dummyOnSubmit,
  };

  return <TrainingFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
