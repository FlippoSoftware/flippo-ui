import React from 'react';

import { FormatBoldIcon, FormatItalicIcon, FormatUndelineIcon } from '@flippo-ui/icons';

import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from '..';
import { Button } from '../../Button';

const meta: Meta<typeof Tooltip.Root> = {
    title: 'Overlay/Tooltip',
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

export const Multiple: TooltipStory = {
    render: () => (
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Tooltip.Multiple>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild primary>
                        <Button icon><FormatBoldIcon /></Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner side={'right'}>
                            <Tooltip.Popup>
                                <Tooltip.Arrow>
                                    <Tooltip.Arrow.Svg />
                                </Tooltip.Arrow>
                                {'Bold'}
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild primary>
                        <Button icon><FormatItalicIcon /></Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner side={'right'}>
                            <Tooltip.Popup>
                                <Tooltip.Arrow>
                                    <Tooltip.Arrow.Svg />
                                </Tooltip.Arrow>
                                {'Italic'}
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>

                <Tooltip.Root>
                    <Tooltip.Trigger asChild primary>
                        <Button icon><FormatUndelineIcon /></Button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Positioner side={'right'}>
                            <Tooltip.Popup>
                                <Tooltip.Arrow>
                                    <Tooltip.Arrow.Svg />
                                </Tooltip.Arrow>
                                {'Underline'}
                            </Tooltip.Popup>
                        </Tooltip.Positioner>
                    </Tooltip.Portal>
                </Tooltip.Root>

            </Tooltip.Multiple>
        </div>

    )
};
