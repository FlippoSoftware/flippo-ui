'use client';

import React from 'react';

import { useAnchorPositioning } from '@lib/hooks';

import type { TSide, UseAnchorPositioning } from '@lib/hooks';
import type { HTMLProps } from '@lib/types';

import { useTooltipRootContext } from '../root/TooltipRootContext';

export function useTooltipPositioner(
    params: UseTooltipPositioner.Parameters
): UseTooltipPositioner.ReturnValue {
    const {
        open,
        trackCursorAxis,
        hoverable,
        mounted
    } = useTooltipRootContext();

    const positioning = useAnchorPositioning(params);

    const props = React.useMemo<HTMLProps>(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open || trackCursorAxis === 'both' || !hoverable) {
            hiddenStyles.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style: {
                ...positioning.positionerStyles,
                ...hiddenStyles
            }
        };
    }, [
        open,
        trackCursorAxis,
        hoverable,
        mounted,
        positioning.positionerStyles
    ]);

    return React.useMemo(
        () => ({
            props,
            ...positioning
        }),
        [props, positioning]
    );
}

export namespace UseTooltipPositioner {
    export type Parameters = {} & UseAnchorPositioning.Parameters;

    export type SharedParameters = {
        side?: TSide;
    } & UseAnchorPositioning.SharedParameters;

    export type ReturnValue = {
        props: HTMLProps;
    } & UseAnchorPositioning.ReturnValue;
}
