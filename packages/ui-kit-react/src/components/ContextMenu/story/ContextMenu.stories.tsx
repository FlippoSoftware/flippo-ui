import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ContextMenu } from '../index';

const meta: Meta<typeof ContextMenu.Root> = {
    title: 'Overlay/ContextMenu',
    component: ContextMenu.Root
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <div style={{
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    userSelect: 'none'
                }}
                >
                    {'Right click me'}
                </div>
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Backdrop />
                <ContextMenu.Positioner>
                    <ContextMenu.Popup>
                        <ContextMenu.Item>
                            {'Cut'}
                        </ContextMenu.Item>
                        <ContextMenu.Item>
                            {'Copy'}
                        </ContextMenu.Item>
                        <ContextMenu.Item>
                            {'Paste'}
                        </ContextMenu.Item>
                        <ContextMenu.Separator />
                        <ContextMenu.Item>
                            {'Delete'}
                        </ContextMenu.Item>
                    </ContextMenu.Popup>
                </ContextMenu.Positioner>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    )
};
