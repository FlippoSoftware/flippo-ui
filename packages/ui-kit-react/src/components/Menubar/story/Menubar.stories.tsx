import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Menubar } from '..';

const meta: Meta<typeof Menubar> = {
    title: 'Navigation/Menubar',
    component: Menubar
};

export default meta;

type MenubarStory = StoryObj<typeof Menubar>;

// Note: This is a simplified example. In a real app, you would use Menu components inside Menubar
export const Default: MenubarStory = {
    render: (args) => (
        <Menubar {...args}>
            <button style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px'
            }}
            >
                {'File'}
            </button>
            <button style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px'
            }}
            >
                {'Edit'}
            </button>
            <button style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px'
            }}
            >
                {'View'}
            </button>
            <button style={{
                padding: '8px 12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px'
            }}
            >
                {'Help'}
            </button>
        </Menubar>
    )
};
