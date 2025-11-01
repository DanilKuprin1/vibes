import type { Meta, StoryObj } from "@storybook/react-vite";

import LogoText from "./LogoText";

const meta = {
  component: LogoText,
} satisfies Meta<typeof LogoText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    layout: "centered",
  },
};
