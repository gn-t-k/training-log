import { AvatarIconAndNameView } from "./avatar-icon-and-name";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof AvatarIconAndNameView>;
type Props = ComponentProps<typeof AvatarIconAndNameView>;
type Story = ComponentStoryObj<typeof AvatarIconAndNameView>;

const componentMeta: Meta = {
  component: AvatarIconAndNameView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    trainee: props.trainee ?? {
      id: "id",
      image: "https://bit.ly/dan-abramov",
      name: "Dan Abramov",
    },
  };

  return <AvatarIconAndNameView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
