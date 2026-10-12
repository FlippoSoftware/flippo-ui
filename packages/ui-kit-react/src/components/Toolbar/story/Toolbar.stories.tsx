import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Toolbar } from '..';

const meta: Meta<typeof Toolbar.Root> = {
    title: 'Layout/Toolbar',
    component: Toolbar.Root
};

export default meta;

type ToolbarStory = StoryObj<typeof Toolbar.Root>;

export const Default: ToolbarStory = {
    render: (args) => (
        <Toolbar.Root {...args}>
            <Toolbar.Button>{'📁 New'}</Toolbar.Button>
            <Toolbar.Button>{'💾 Save'}</Toolbar.Button>
            <Toolbar.Button>{'📋 Copy'}</Toolbar.Button>
            <Toolbar.Separator />
            <Toolbar.Button>{'↶ Undo'}</Toolbar.Button>
            <Toolbar.Button>{'↷ Redo'}</Toolbar.Button>
        </Toolbar.Root>
    )
};
