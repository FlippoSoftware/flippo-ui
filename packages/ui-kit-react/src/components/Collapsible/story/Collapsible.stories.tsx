import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Collapsible } from '..';

const meta: Meta<typeof Collapsible.Root> = {
    title: 'Display/Collapsible',
    component: Collapsible.Root
};

export default meta;

type CollapsibleStory = StoryObj<typeof Collapsible.Root>;

export const Default: CollapsibleStory = {
    render: (args) => (
        <Collapsible.Root {...args} style={{ width: '500px' }}>
            <Collapsible.Trigger>
                {'Toggle Content'}
                <Collapsible.Trigger.Svg />
            </Collapsible.Trigger>
            <Collapsible.Panel>
                <div style={{ padding: '16px' }}>
                    <p>{'This content can be collapsed and expanded.'}</p>
                    <p>
                        {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '}
                        {'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                    </p>
                </div>
            </Collapsible.Panel>
        </Collapsible.Root>
    )
};
