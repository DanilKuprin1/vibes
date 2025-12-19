import type { Meta, StoryObj } from "@storybook/react-vite";
import { RealtimeChat } from "./RealtimeChat";

const meta = {
  title: "Chat/RealtimeChat",
  component: RealtimeChat,
} satisfies Meta<typeof RealtimeChat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    roomName: "4db4e390-19c5-42af-b216-b1b624ebe6d8",
    username: "3b9cbb93-a744-4b2b-88d0-4c6a9f9cb6f6",
  },
};
