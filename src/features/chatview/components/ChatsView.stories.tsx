// ChatsView.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import ChatsView from "@/features/chatview/components/ChatsView";

const meta = {
  title: "Pages/ChatsView",
  component: ChatsView,
  parameters: {
    reactRouter: {
      pathname: "/session",
      state: { firstTimeUser: true, matchedWithUser: "alex" },
    },
  },
} satisfies Meta<typeof ChatsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
