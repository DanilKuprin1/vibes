// SessionPage.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import SessionPage from "@/features/chatview/components/SessionPage";

const meta = {
  title: "Pages/SessionPage",
  component: SessionPage,
  parameters: {
    reactRouter: {
      pathname: "/session",
      state: { firstTimeUser: true, matchedWithUser: "alex" },
    },
  },
} satisfies Meta<typeof SessionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
