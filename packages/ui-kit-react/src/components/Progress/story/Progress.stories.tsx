import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from '..';

const meta: Meta<typeof Progress.Root> = {
    title: 'Display/Progress',
    component: Progress.Root
};

export default meta;

type ProgressStory = StoryObj<typeof Progress.Root>;

export const Default: ProgressStory = {
    render: (args) => (
        <Progress.Root {...args} value={60} max={100}>
            <Progress.Label>{'Loading...'}</Progress.Label>
            <Progress.Value />
            <Progress.Track>
                <Progress.Indicator />
            </Progress.Track>
        </Progress.Root>
    )
};
