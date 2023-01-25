import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import * as stories from "./training-form.stories";

describe("TrainingForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("初期状態のテスト");
  });
});
