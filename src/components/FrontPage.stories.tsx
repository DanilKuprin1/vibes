import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router";
import FrontPage from "./FrontPage";

const meta: Meta<typeof FrontPage> = {
  title: "Pages/FrontPage",
  component: FrontPage,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    backgrounds: { default: "light" }, // example of per-story configuration
  },
};
export default meta;

type Story = StoryObj<typeof FrontPage>;

export const Default: Story = {};
