import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { sleep } from "@/utils/sleep";

import { EditMuscleModal } from "./edit-muscle-modal";

type Meta = ComponentMeta<typeof EditMuscleModal>;
type Props = ComponentProps<typeof EditMuscleModal>;
type Story = ComponentStoryObj<typeof EditMuscleModal>;

const componentMeta: Meta = {
  component: EditMuscleModal,
};
export default componentMeta;

const Template: Story = {
  render: (props: Partial<Props>) => {
    const args: Props = {}

    return <EditMuscleModal {...args} />
  },
};
export const Default: Story = {
  ...Template,
};