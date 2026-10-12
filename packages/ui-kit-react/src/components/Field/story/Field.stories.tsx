import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Field } from '..';

const meta: Meta<typeof Field.Root> = {
    title: 'Form/Field',
    component: Field.Root
};

export default meta;

type FieldStory = StoryObj<typeof Field.Root>;

export const Default: FieldStory = {
    render: (args) => (
        <Field.Root {...args}>
            <Field.Label>{'Email Address'}</Field.Label>
            <Field.Control>
                <Field.Control.Slot />
            </Field.Control>
            <Field.Description>
                {'We\'ll never share your email with anyone else.'}
            </Field.Description>
        </Field.Root>
    )
};
