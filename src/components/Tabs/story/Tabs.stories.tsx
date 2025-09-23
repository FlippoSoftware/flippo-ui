import React from 'react';

import { PlusIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from '..';

const meta: Meta<typeof Tabs.Root> = {
    component: Tabs.Root,
    title: 'Navigation/Tabs'
};

export default meta;

type TabsStory = StoryObj<typeof Tabs.Root>;

export const Default: TabsStory = {
    args: {},
    render: () => (
        <Tabs.Root>
            <Tabs.List>
                <Tabs.Tab>
                    <PlusIcon />
                    {'Tab 1'}
                </Tabs.Tab>
                <Tabs.Tab>
                    <PlusIcon />
                    {'Tab 2'}
                </Tabs.Tab>
                <Tabs.Tab>
                    <PlusIcon />
                    {'Tab 3'}
                </Tabs.Tab>
                <Tabs.Indicator />
            </Tabs.List>
        </Tabs.Root>
    )
};
