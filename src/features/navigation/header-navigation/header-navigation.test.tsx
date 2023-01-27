import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./header-navigation.stories";

describe("HeaderNavigation", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("", () => {});
  });
});