'use client';

import React from 'react';

import { TooltipRootContext } from './TooltipRootContext';
import { useTooltipRoot } from './useTooltipRoot';

import type { TTooltipOpenChangeReason, UseTooltipRoot } from './useTooltipRoot';

export function TooltipRoot(props: TooltipRoot.Props) {
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

export namespace TooltipRoot {
    export type Props = React.PropsWithChildren<UseTooltipRoot.Params>;

    export type Actions = UseTooltipRoot.Actions;

    export type OpenChangeReason = TTooltipOpenChangeReason;
}
