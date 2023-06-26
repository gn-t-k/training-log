import { Loading } from "./loading";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof Loading>;
type Props = ComponentProps<typeof Loading>;
type Story = ComponentStoryObj<typeof Loading>;

const componentMeta: Meta = {
  component: Loading,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    full: props.full,
    description: props.description,
  };

  return <Loading {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};

export const フル: Story = {
  ...Template,
  args: {
    full: true,
  },
};

export const テキスト: Story = {
  ...Template,
  args: {
    description: "トレーニング情報を取得しています",
  },
};

export const フルかつテキスト: Story = {
  ...Template,
  args: {
    full: true,
    description: "トレーニング情報を取得しています",
  },
};
