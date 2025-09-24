import React from 'react';

import { FormatBoldIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Tooltip.Root> = {
    title: 'Overlays/Tooltip',
    component: Tooltip.Root
};

export default meta;

type TooltipStory = StoryObj<typeof Tooltip.Root>;

export const Default: TooltipStory = {
    args: { children: (
        <React.Fragment>
            <Tooltip.Trigger asChild>
                <Button icon><FormatBoldIcon /></Button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Positioner>
                    <Tooltip.Popup>
                        <Tooltip.Arrow>
                            <Tooltip.Arrow.Svg />
                        </Tooltip.Arrow>
                        {'Bold'}
                    </Tooltip.Popup>
                </Tooltip.Positioner>
            </Tooltip.Portal>
        </React.Fragment>
    ) }
};
