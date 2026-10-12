import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from '..';

const meta: Meta<typeof Switch.Root> = {
    title: 'Input/Switch',
    component: Switch.Root
};

export default meta;

type SwitchStory = StoryObj<typeof Switch.Root>;

export const Default: SwitchStory = {
    render: (args) => (
        <Switch.Root {...args}>
            <Switch.Thumb />
        </Switch.Root>
    )
};
