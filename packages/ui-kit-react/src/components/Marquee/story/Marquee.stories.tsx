import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Marquee } from '../index';

const meta = {
    title: 'Widgets/Marquee',
    component: Marquee.Root,
    parameters: {
        layout: 'padded'
    },
    tags: ['autodocs']
} satisfies Meta<typeof Marquee.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Marquee.Root>
            <Marquee.Track>
                <span style={{ padding: '0 16px' }}>{'🚀'}</span>
                <span style={{ padding: '0 16px' }}>{'⭐'}</span>
                <span style={{ padding: '0 16px' }}>{'🎉'}</span>
            </Marquee.Track>
        </Marquee.Root>
    )
};

export const NotAutoFill: Story = {
    render: () => (
        <Marquee.Root autoFill={false}>
            <Marquee.Track>
                <span style={{ padding: '0 16px' }}>{'Item 1'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 2'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 3'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 4'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 5'}</span>
            </Marquee.Track>
        </Marquee.Root>
    )
};

export const Reverse: Story = {
    render: () => (
        <Marquee.Root direction={'reverse'}>
            <Marquee.Track>
                <span style={{ padding: '0 16px' }}>{'Item 1'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 2'}</span>
                <span style={{ padding: '0 16px' }}>{'Item 3'}</span>
            </Marquee.Track>
        </Marquee.Root>
    )
};

export const Vertical: Story = {
    render: () => (
        <div style={{ height: 200 }}>
            <Marquee.Root orientation={'vertical'} style={{ height: '100%' }}>
                <Marquee.Track>
                    <div style={{ padding: '8px 0' }}>{'Row 1'}</div>
                    <div style={{ padding: '8px 0' }}>{'Row 2'}</div>
                    <div style={{ padding: '8px 0' }}>{'Row 3'}</div>
                    <div style={{ padding: '8px 0' }}>{'Row 4'}</div>
                </Marquee.Track>
            </Marquee.Root>
        </div>
    )
};

export const PauseOnHover: Story = {
    render: () => (
        <Marquee.Root pauseOnHover>
            <Marquee.Track>
                <span style={{ padding: '0 16px' }}>{'Hover to pause'}</span>
                <span style={{ padding: '0 16px' }}>{'Move away to resume'}</span>
            </Marquee.Track>
        </Marquee.Root>
    )
};

export const CustomSpeed: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Marquee.Root speed={20} autoFill>
                <Marquee.Track>
                    <span style={{ padding: '0 16px' }}>{'Slow (20px/s)'}</span>
                </Marquee.Track>
            </Marquee.Root>
            <Marquee.Root speed={100} autoFill>
                <Marquee.Track>
                    <span style={{ padding: '0 16px' }}>{'Fast (100px/s)'}</span>
                </Marquee.Track>
            </Marquee.Root>
        </div>
    )
};
