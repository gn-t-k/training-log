import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { ComponentProps, FC, useState } from "react";

import { sleep } from "@/utils/sleep";

import { RegisterMuscleFormView } from "./register-muscle-form";

type Meta = ComponentMeta<typeof RegisterMuscleFormView>;
type Props = ComponentProps<typeof RegisterMuscleFormView>;
type Story = ComponentStoryObj<typeof RegisterMuscleFormView>;

const componentMeta: Meta = {
  component: RegisterMuscleFormView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const dummyRegisterMuscle: Props["registerMuscle"] = (name) => {
    (async (): Promise<void> => {
      setIsLoading(true);
      await sleep(1000);
      setIsLoading(false);

      action("muscle registered")(name);
    })();
  };
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
    registerMuscle: props.registerMuscle ?? dummyRegisterMuscle,
    isRegisterMuscleLoading: props.isRegisterMuscleLoading ?? isLoading,
    isRegisterMuscleError: props.isRegisterMuscleError ?? false,
  };

  return <RegisterMuscleFormView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};
export const Default: Story = {
  ...Template,
};
