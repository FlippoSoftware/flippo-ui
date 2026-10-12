import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '..';

const meta: Meta<typeof Avatar.Root> = {
    title: 'Display/Avatar',
    component: Avatar.Root
};

export default meta;

type AvatarStory = StoryObj<typeof Avatar.Root>;

export const Default: AvatarStory = {
    render: (args) => (
        <Avatar.Root {...args}>
            <Avatar.Image src={'https://i.pravatar.cc/150?img=1'} alt={'User avatar'} />
            <Avatar.Fallback>{'AB'}</Avatar.Fallback>
        </Avatar.Root>
    )
};
