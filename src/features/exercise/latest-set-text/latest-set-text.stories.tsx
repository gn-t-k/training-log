import { LatestSetTextView } from "./latest-set-text";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof LatestSetTextView>;
type Props = ComponentProps<typeof LatestSetTextView>;
type Story = ComponentStoryObj<typeof LatestSetTextView>;

const componentMeta: Meta = {
  component: LatestSetTextView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    set: props.set ?? {
      id: "id",
      weight: 50,
      repetition: 10,
    },
  };

  return <LatestSetTextView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
