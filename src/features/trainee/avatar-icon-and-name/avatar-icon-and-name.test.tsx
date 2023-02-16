import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import * as stories from "./avatar-icon-and-name.stories";

describe("AvatarIconAndName", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("テスト");
  });
});
