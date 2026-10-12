import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { RadioGroup } from '..';
import { Radio } from '../../Radio';

const meta: Meta<typeof RadioGroup> = {
    title: 'Input/RadioGroup',
    component: RadioGroup
};

export default meta;

type RadioGroupStory = StoryObj<typeof RadioGroup>;

export const Default: RadioGroupStory = {
    render: (args) => (
        <RadioGroup {...args} defaultValue={'option2'}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Radio.Root value={'option1'}>
                    <Radio.Indicator />
                </Radio.Root>
                {'Option 1'}
            </label>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Radio.Root value={'option2'}>
                    <Radio.Indicator />
                </Radio.Root>
                {'Option 2'}
            </label>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Radio.Root value={'option3'}>
                    <Radio.Indicator />
                </Radio.Root>
                {'Option 3'}
            </label>
        </RadioGroup>
    )
};
