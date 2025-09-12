import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { InputControl } from '../ui/control/InputControl';

const meta: Meta = {
    argTypes: {
        children: { control: 'object', name: 'React.ReactNode' },
        disabled: { control: 'boolean' },
        size: {
            control: 'select',
            options: [
                'x-small',
                'small',
                'medium',
                'large'
            ]
        },
        variant: {
            control: 'select',
            options: [
                'danger',
                'label',
                'outlined',
                'secondary',
                'primary'
            ]
        }
    },
    component: InputControl,
    title: 'UIKit/Input'
};

export default meta;

type ButtonStory = StoryObj<typeof InputControl>;

export const Input: ButtonStory = {
    args: {
    }
};
