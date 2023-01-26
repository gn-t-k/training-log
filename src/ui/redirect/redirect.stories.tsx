import { RedirectView } from "./redirect";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RedirectView>;
type Props = ComponentProps<typeof RedirectView>;
type Story = ComponentStoryObj<typeof RedirectView>;

const componentMeta: Meta = {
  component: RedirectView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    redirectTo: props.redirectTo ?? { pathname: "/" },
  };

  return <RedirectView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
