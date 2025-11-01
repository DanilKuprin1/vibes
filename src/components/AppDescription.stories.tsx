import type { Meta, StoryObj } from '@storybook/react-vite';

import AppDescription from './AppDescription';

const meta = {
  component: AppDescription,
} satisfies Meta<typeof AppDescription>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};