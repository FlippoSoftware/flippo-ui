import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Slider } from '..';

const meta: Meta<typeof Slider.Root> = {
    title: 'Input/Slider',
    component: Slider.Root
};

export default meta;

type SliderStory = StoryObj<typeof Slider.Root>;

export const Default: SliderStory = {
    render: (args) => (
        <div style={{ width: '300px' }}>
            <Slider.Root {...args} defaultValue={[50]} min={0} max={100}>
                <Slider.Value />
                <Slider.Control>
                    <Slider.Track>
                        <Slider.Indicator />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider.Control>
            </Slider.Root>
        </div>
    )
};
