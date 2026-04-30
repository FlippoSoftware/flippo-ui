import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from '../';

const meta: Meta<typeof Spinner> = {
    title: 'Components/Spinner',
    component: Spinner
};

export default meta;

export const Default: StoryObj<typeof Spinner> = {
    args: {
        color: 'brand',
        size: 'medium'
    }
};
