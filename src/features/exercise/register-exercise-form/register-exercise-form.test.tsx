import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./register-exercise-form.stories";

describe("RegisterExerciseForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test.todo("", () => {});
  });
});