import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxGroup } from '..';
import { Checkbox } from '../../Checkbox';

const meta: Meta<typeof CheckboxGroup> = {
    title: 'Input/CheckboxGroup',
    component: CheckboxGroup
};

export default meta;

type CheckboxGroupStory = StoryObj<typeof CheckboxGroup>;

export const Default: CheckboxGroupStory = {
    render: (args) => (
        <CheckboxGroup {...args} defaultValue={['option2']}>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Checkbox.Root value={'option1'}>
                    <Checkbox.Indicator>
                        <Checkbox.Indicator.Svg />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                {'Option 1'}
            </label>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Checkbox.Root value={'option2'}>
                    <Checkbox.Indicator>
                        <Checkbox.Indicator.Svg />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                {'Option 2'}
            </label>
            <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            >
                <Checkbox.Root value={'option3'}>
                    <Checkbox.Indicator>
                        <Checkbox.Indicator.Svg />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                {'Option 3'}
            </label>
        </CheckboxGroup>
    )
};
