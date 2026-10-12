import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from '..';

const meta: Meta<typeof ScrollArea.Root> = {
    title: 'Layout/ScrollArea',
    component: ScrollArea.Root
};

export default meta;

type ScrollAreaStory = StoryObj<typeof ScrollArea.Root>;

export const Vertical: ScrollAreaStory = {
    render: (args) => (
        <ScrollArea.Root {...args} style={{ width: '300px', height: '200px' }}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    <div style={{ padding: '16px' }}>
                        {Array.from({ length: 20 }, (_, i) => (
                            <p key={i} style={{ margin: '8px 0' }}>
                                {'Item '}
                                {i + 1}
                                {': Lorem ipsum dolor sit amet consectetur.'}
                            </p>
                        ))}
                    </div>
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation={'vertical'}>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
};

export const Horizontal: ScrollAreaStory = {
    render: (args) => (
        <ScrollArea.Root {...args} style={{ width: '300px', height: '100px' }}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        padding: '16px',
                        width: 'max-content'
                    }}
                    >
                        {Array.from({ length: 20 }, (_, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '80px',
                                    height: '60px',
                                    backgroundColor: 'var(--f-color-bg-1-hover)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation={'horizontal'}>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
};

export const Both: ScrollAreaStory = {
    render: (args) => (
        <ScrollArea.Root {...args} style={{ width: '300px', height: '200px' }}>
            <ScrollArea.Viewport>
                <ScrollArea.Content>
                    <div style={{ width: '600px', padding: '16px' }}>
                        {Array.from({ length: 20 }, (_, i) => (
                            <p key={i} style={{ margin: '8px 0', whiteSpace: 'nowrap' }}>
                                {'Item '}
                                {i + 1}
                                {': Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates.'}
                            </p>
                        ))}
                    </div>
                </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation={'vertical'}>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar orientation={'horizontal'}>
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
        </ScrollArea.Root>
    )
};
