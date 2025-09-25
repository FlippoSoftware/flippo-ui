import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '..';

const meta: Meta<typeof Checkbox.Root> = {
    title: 'Input/Checkbox',
    component: Checkbox.Root
};

export default meta;

type CheckboxStory = StoryObj<typeof Checkbox.Root>;

export const Default: CheckboxStory = {
    render: (args) => (
        <Checkbox.Root {...args}>
            <Checkbox.Indicator />
        </Checkbox.Root>
    )
};
