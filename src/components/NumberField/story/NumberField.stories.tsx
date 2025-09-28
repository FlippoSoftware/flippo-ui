import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { NumberField } from '..';

const meta: Meta<typeof NumberField.Root> = {
    title: 'Input/NumberField',
    component: NumberField.Root
};

export default meta;

type NumberFieldStory = StoryObj<typeof NumberField.Root>;

export const Default: NumberFieldStory = {
    render: (args) => (
        <NumberField.Root {...args} defaultValue={42}>
            <NumberField.Group>
                <NumberField.Decrement><NumberField.Decrement.Svg /></NumberField.Decrement>
                <NumberField.Input />
                <NumberField.Increment><NumberField.Increment.Svg /></NumberField.Increment>
            </NumberField.Group>
        </NumberField.Root>
    )
};
