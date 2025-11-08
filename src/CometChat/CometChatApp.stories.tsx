// src/CometChatApp.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import CometChatApp from "./CometChatApp";

const meta = {
  title: "CometChat/CometChatApp", // → id prefix: cometchat-cometchatapp
  component: CometChatApp,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CometChatApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: undefined,
    group: undefined,
    showGroupActionMessages: true,
  },
};
