'use client';

import React from 'react';

import { TooltipRootContext } from './TooltipRootContext';
import { useTooltipRoot } from './useTooltipRoot';

import type { NUseTooltipRoot, TTooltipOpenChangeReason } from './useTooltipRoot';

export function TooltipRoot(props: NTooltipRoot.Props) {
    const {
        children,
        disabled = false,
        defaultOpen = false,
        onOpenChange,
        open,
        delay,
        closeDelay,
        hoverable = true,
        trackCursorAxis = 'none',
        actionsRef,
        onOpenChangeComplete
    } = props;

    const tooltipRoot = useTooltipRoot({
        ...props,
        defaultOpen,
        onOpenChange,
        open,
        hoverable,
        trackCursorAxis,
        delay,
        closeDelay,
        actionsRef,
        onOpenChangeComplete,
        disabled
    });

    return (
        <TooltipRootContext value={tooltipRoot}>
            {children}
        </TooltipRootContext>
    );
}

export namespace NTooltipRoot {
    export type Props = React.PropsWithChildren<NUseTooltipRoot.Params>;

    export type Actions = NUseTooltipRoot.Actions;

    export type OpenChangeReason = TTooltipOpenChangeReason;
}
