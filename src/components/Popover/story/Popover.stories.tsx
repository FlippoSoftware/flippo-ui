import React from 'react';

import { NotificationsIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { Popover } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Popover.Root> = {
    title: 'Overlay/Popover',
    component: Popover.Root
};

export default meta;

type PopoverStory = StoryObj<typeof Popover.Root>;

export const Default: PopoverStory = {
    render: (args) => (
        <div style={{ padding: '50px', display: 'flex', justifyContent: 'center' }}>
            <Popover.Root {...args}>
                <Popover.Trigger asChild>
                    <Button variant={'secondary'} icon>
                        <NotificationsIcon />
                    </Button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Backdrop />
                    <Popover.Positioner sideOffset={8}>
                        <Popover.Popup>
                            <Popover.Arrow>
                                <Popover.Arrow.Svg />
                            </Popover.Arrow>
                            <Popover.Title>
                                {'Popover Title'}
                            </Popover.Title>
                            <Popover.Description>
                                {'This is a popover with some content. Popovers are great for '}
                                {'displaying additional information or actions.'}
                            </Popover.Description>
                        </Popover.Popup>
                    </Popover.Positioner>
                </Popover.Portal>
            </Popover.Root>
        </div>
    )
};
