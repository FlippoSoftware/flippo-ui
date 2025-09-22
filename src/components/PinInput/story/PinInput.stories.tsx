import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { PinInput } from '..';

const meta: Meta<typeof PinInput.Root> = {
    title: 'UIKit/Inputs/PinInput',
    component: PinInput.Root
};

export default meta;

type PinInputStory = StoryObj<typeof PinInput.Root>;

export const PinInputInverted: PinInputStory = {
    args: {},
    render: () => (
        <PinInput.Root onValueComplete={() => {}}>
            <PinInput.FocusFunnel>
                <PinInput.Pin />
                <PinInput.Pin />
                <PinInput.Pin />
                <PinInput.Pin />
            </PinInput.FocusFunnel>
        </PinInput.Root>
    )
};

export const PinInputLight: PinInputStory = {
    args: {},
    render: () => (
        <PinInput.Root onValueComplete={() => {}}>
            <PinInput.FocusFunnel>
                <PinInput.Pin variant={'light'} />
                <PinInput.Pin variant={'light'} />
                <PinInput.Pin variant={'light'} />
                <PinInput.Pin variant={'light'} />
            </PinInput.FocusFunnel>
        </PinInput.Root>
    )
};
