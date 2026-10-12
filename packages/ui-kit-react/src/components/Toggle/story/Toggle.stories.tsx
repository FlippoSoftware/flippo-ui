import React from 'react';

import { ShuffleIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { Toggle } from '..';

const meta: Meta<typeof Toggle> = {
    title: 'Input/Toggle',
    component: Toggle
};

export default meta;

type ToggleStory = StoryObj<typeof Toggle>;

export const Default: ToggleStory = {
    args: { children: <ShuffleIcon /> }
};
