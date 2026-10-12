import React from 'react';

import { BookmarksIcon, NotificationsIcon, ShuffleIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { ToggleGroup } from '..';
import { Toggle } from '../../Toggle';

const meta: Meta<typeof ToggleGroup> = {
    title: 'Input/ToggleGroup',
    component: ToggleGroup
};

export default meta;

type ToggleGroupStory = StoryObj<typeof ToggleGroup>;

export const Default: ToggleGroupStory = {
    args: { children: (
        <React.Fragment>
            <Toggle value={'shuffle'}>
                <ShuffleIcon />
            </Toggle>
            <Toggle value={'notifications'}>
                <NotificationsIcon />
            </Toggle>
            <Toggle value={'bookmarks'}>
                <BookmarksIcon />
            </Toggle>
        </React.Fragment>
    ) }
};
