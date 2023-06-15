import { action } from "@storybook/addon-actions";
import { useState } from "react";

import { sleep } from "@/_utils/sleep";

import { RegisterForm } from "./register-form";

import type { MutationState } from "@/_utils/mutation-state";
import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof RegisterForm>;
type Props = ComponentProps<typeof RegisterForm>;
type Story = ComponentStoryObj<typeof RegisterForm>;

const componentMeta: Meta = {
  component: RegisterForm,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [registerStatus, setRegisterStatus] = useState<MutationState>("idle");
  const register: Props["register"] = () => {
    void (async (): Promise<void> => {
      setRegisterStatus("loading");
      await sleep(1000);
      action("register");
      setRegisterStatus("success");
    })();
  };
  const args: Props = {
    register: props.register ?? register,
    registerStatus: props.registerStatus ?? registerStatus,
  };

  return <RegisterForm {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
