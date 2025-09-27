import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Fieldset } from '..';
import { Field } from '../../Field';
import { Input } from '../../Input';

const meta: Meta<typeof Fieldset.Root> = {
    title: 'Form/Fieldset',
    component: Fieldset.Root
};

export default meta;

type FieldsetStory = StoryObj<typeof Fieldset.Root>;

export const Default: FieldsetStory = {
    render: (args) => (
        <Fieldset.Root {...args}>
            <Fieldset.Legend>{'Personal Information'}</Fieldset.Legend>

            <Field.Root>
                <Field.Label>{'First Name'}</Field.Label>
                <Input.Root>
                    <Input.Body>
                        <Input.Slot />
                    </Input.Body>
                </Input.Root>
            </Field.Root>
        </Fieldset.Root>
    )
};
