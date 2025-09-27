import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Form } from '..';
import { Button } from '../../Button';
import { Field } from '../../Field';
import { Input } from '../../Input';

const meta: Meta<typeof Form> = {
    title: 'Form/Form',
    component: Form
};

export default meta;

type FormStory = StoryObj<typeof Form>;

function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
}

export const Default: FormStory = {
    render: (args) => (
        <Form {...args} onSubmit={handleSubmit}>
            <Field.Root>
                <Field.Label>
                    {'Name'}
                </Field.Label>
                <Input.Root>
                    <Input.Body>
                        <Input.Slot />
                    </Input.Body>
                </Input.Root>
            </Field.Root>
            <Button>
                {'Submit'}
            </Button>
        </Form>
    )
};
