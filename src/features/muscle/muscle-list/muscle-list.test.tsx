import { composeStories } from "@storybook/testing-react";
import { render, screen } from "@testing-library/react";

import { Muscle } from "../muscle";
import * as stories from "./muscle-list.stories";

describe("MuscleList", () => {
  const Stories = composeStories(stories);

  describe("初期状態", () => {
    const muscle: Muscle = {
      id: "id",
      name: "大胸筋",
    };

    beforeEach(() => {
      render(<Stories.Default muscles={[muscle]} />);
    });

    test("部位が表示されている", () => {
      const muscleElement = screen.getByText(muscle.name);

      expect(muscleElement).toBeInTheDocument();
    });
  });
});
