import React from 'react';

import { TooltipProviderMachine } from '@flippo-software/core-components/tooltip';

import { useMachine } from '~@lib/core';

import { TooltipProviderContext } from './TooltipProviderContext';

/**
 * Provides a shared delay for multiple tooltips. The grouping logic ensures that
 * once a tooltip becomes visible, the adjacent tooltips will be shown instantly.
 */
export function TooltipProvider(props: TooltipProviderProps) {
    const { delay, closeDelay, timeout = 400, children } = props;

    const provider = useMachine((options) => new TooltipProviderMachine(options), { delay, closeDelay, timeout });

    return <TooltipProviderContext value={provider}>{children}</TooltipProviderContext>;
}

export type TooltipProviderProps = {
    children?: React.ReactNode;
    /**
     * How long to wait before opening a tooltip. Specified in milliseconds.
     */
    delay?: number;
    /**
     * How long to wait before closing a tooltip. Specified in milliseconds.
     */
    closeDelay?: number;
    /**
     * Another tooltip will open instantly if the previous tooltip
     * is closed within this timeout. Specified in milliseconds.
     * @default 400
     */
    timeout?: number;
};

export namespace TooltipProvider {
    export type Props = TooltipProviderProps;
}
