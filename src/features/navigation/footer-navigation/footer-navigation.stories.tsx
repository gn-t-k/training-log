import { Text } from "@chakra-ui/react";

import { FooterNavigationView } from "./footer-navigation";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof FooterNavigationView>;
type Props = ComponentProps<typeof FooterNavigationView>;
type Story = ComponentStoryObj<typeof FooterNavigationView>;

const componentMeta: Meta = {
  component: FooterNavigationView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    children: props.children ?? <Text>テスト</Text>,
  };

  return <FooterNavigationView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
