import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Textarea } from '..';

const meta: Meta<typeof Textarea.Root> = {
    title: 'Input/Textarea',
    component: Textarea.Root
};

export default meta;

type TextareaStory = StoryObj<typeof Textarea>;

export const Default: TextareaStory = {
    render: () => (
        <Textarea.Root>
            <Textarea.Body>
                <Textarea.Slot />
            </Textarea.Body>
        </Textarea.Root>
    )
};
