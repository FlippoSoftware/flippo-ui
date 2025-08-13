'use client';

import React from 'react';

import { NextFloatingDelayGroup } from '@floating-ui/react';

import { TooltipProviderContext } from './TooltipProviderContext';

export function TooltipProvider(props: NTooltipProvider.Props) {
    const {
        delay,
        closeDelay,
        timeout = 400,
        children
    } = props;

    const contextValue = React.useMemo(() =>
        ({ delay, closeDelay }), [delay, closeDelay]);

    const delayGroup = React.useMemo(() =>
        ({ open: delay, close: closeDelay }), [delay, closeDelay]);

    return (
        <TooltipProviderContext value={contextValue}>
            <NextFloatingDelayGroup delay={delayGroup} timeoutMs={timeout}>
                {children}
            </NextFloatingDelayGroup>
        </TooltipProviderContext>
    );
}

export namespace NTooltipProvider {
    export type Props = React.PropsWithChildren<{
        delay?: number;
        closeDelay?: number;
        timeout?: number;
    }>;
}
