import type { Meta, StoryObj } from '@storybook/react-vite';

import LoginPage from './LoginPage';

const meta = {
  component: LoginPage,
} satisfies Meta<typeof LoginPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};