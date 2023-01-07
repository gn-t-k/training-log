import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps } from "react";

import { sleep } from "@/utils/sleep";

import { MuscleFormView } from "./muscle-form";

type Meta = ComponentMeta<typeof MuscleFormView>;
type Props = ComponentProps<typeof MuscleFormView>;
type Story = ComponentStoryObj<typeof MuscleFormView>;

const componentMeta: Meta = {
  component: MuscleFormView,
};
export default componentMeta;

const Template: Story = {
  render: (props: Partial<Props>) => {
    const args: Props = {
      muscles: props.muscles ?? [
        {
          id: "id1",
          name: "大胸筋",
        },
        {
          id: "id2",
          name: "上腕二頭筋",
        },
      ],
      registerMuscle: () => {
        (async (): Promise<void> => {
          await sleep(1000);

          action("muscle registered")();
        })();
      },
      isRegisterMuscleError: false,
    };

    return <MuscleFormView {...args} />;
  },
};
export const Default: Story = {
  ...Template,
};
