import { EstimatedMaximumWeightTextView } from "./estimated-maximum-weight-text";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof EstimatedMaximumWeightTextView>;
type Props = ComponentProps<typeof EstimatedMaximumWeightTextView>;
type Story = ComponentStoryObj<typeof EstimatedMaximumWeightTextView>;

const componentMeta: Meta = {
  component: EstimatedMaximumWeightTextView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const args: Props = {
    estimatedMaximumWeight: props.estimatedMaximumWeight ?? 100,
  };

  return <EstimatedMaximumWeightTextView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
