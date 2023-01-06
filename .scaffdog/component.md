---
name: 'component'
root: 'src'
output: '{features/*,ui}'
ignore: ['{src,src/features}']
questions:
  name: 'Please enter component name'
---

# `{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.tsx`

```tsx
import { FC } from "react";

type Props = {
};

export const {{ inputs.name | pascal }}: FC<Props> = (props) => <></>;
```

# `{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.stories.tsx`

```tsx
import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { within } from "@storybook/testing-library";
import userEvent from "@testing-library/user-event";
import { ComponentProps } from "react";

import { sleep } from "@/utils/sleep";

import { {{ inputs.name | pascal }} } from "./{{ inputs.name | kebab }}";

type Meta = ComponentMeta<typeof {{ inputs.name | pascal }}>;
type Props = ComponentProps<typeof {{ inputs.name | pascal }}>;
type Story = ComponentStoryObj<typeof {{ inputs.name | pascal }}>;

const componentMeta: Meta = {
  component: {{ inputs.name | pascal }},
};
export default componentMeta;

const Template: Story = {
  render: (props: Partial<Props>) => {
    const args: Props = {}

    return <{{ inputs.name | pascal }} {...args} />
  },
};
export const Default: Story = {
  ...Template,
};
```

# `{{ inputs.name | kebab }}/{{ inputs.name | kebab }}.test.tsx`

```tsx
import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./{{ inputs.name | kebab }}.stories";

describe("{{ inputs.name | pascal }}", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("", () => {});
  });
});
```
