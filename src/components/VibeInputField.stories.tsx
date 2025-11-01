import type { Meta, StoryObj } from "@storybook/react-vite";

import VibeInputField from "./VibeInputField";

const meta = {
  component: VibeInputField,
} satisfies Meta<typeof VibeInputField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: {},
  },
  parameters: {
    layout: "centered",
  },
};
