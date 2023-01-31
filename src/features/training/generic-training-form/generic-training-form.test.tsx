import { composeStories } from "@storybook/testing-react";
import { render } from "@testing-library/react";

import * as stories from "./generic-training-form.stories";

describe("GenericTrainingForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("テスト");
  });
});
