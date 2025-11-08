import type { Meta, StoryObj } from '@storybook/react-vite';

import SessionPage from './SessionPage';

const meta = {
  component: SessionPage,
} satisfies Meta<typeof SessionPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};