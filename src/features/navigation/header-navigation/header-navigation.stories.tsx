import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Button, Container, Stack, Text } from "@chakra-ui/react";

import { HeaderNavigationView } from "./header-navigation";

import type { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import type { ComponentProps, FC } from "react";

type Meta = ComponentMeta<typeof HeaderNavigationView>;
type Props = ComponentProps<typeof HeaderNavigationView>;
type Story = ComponentStoryObj<typeof HeaderNavigationView>;

const componentMeta: Meta = {
  component: HeaderNavigationView,
};
export default componentMeta;

const Wrapper: FC<Partial<Props>> = (props) => {
  const Children: FC = () => {
    return (
      <Container>
        <Stack direction="column">
          <Text>先頭</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
          <Text>テスト</Text>
        </Stack>
      </Container>
    );
  };
  const args: Props = {
    title: props.title ?? "タイトル",
    children: props.children ?? <Children />,
    leftItem: props.leftItem ?? (
      <Button>
        <ChevronLeftIcon />
      </Button>
    ),
    rightItem: props.rightItem ?? (
      <Button>
        <AddIcon />
      </Button>
    ),
  };

  return <HeaderNavigationView {...args} />;
};

const Template: Story = {
  render: (props: Partial<Props>) => {
    return <Wrapper {...props} />;
  },
};

export const Default: Story = {
  ...Template,
};
