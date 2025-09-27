import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Meter } from '..';

const meta: Meta<typeof Meter.Root> = {
    title: 'Display/Meter',
    component: Meter.Root
};

export default meta;

type MeterStory = StoryObj<typeof Meter.Root>;

export const Default: MeterStory = {
    render: (args) => (
        <Meter.Root {...args} value={24} min={0} max={100}>
            <Meter.Label>{'Storage Usage'}</Meter.Label>
            <Meter.Value />
            <Meter.Track>
                <Meter.Indicator />
            </Meter.Track>
        </Meter.Root>
    )
};
