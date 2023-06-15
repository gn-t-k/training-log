import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import * as stories from "./register-form.stories";

describe("RegisterForm", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    beforeEach(() => {
      render(<Stories.Default />);
    });

    test("名前フィールド", () => {
      const nameField = screen.getByLabelText("名前");

      expect(nameField).toBeInTheDocument();
    });
  });
});
