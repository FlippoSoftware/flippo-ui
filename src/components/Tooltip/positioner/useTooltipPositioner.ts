'use client';

import React from 'react';

import { useAnchorPositioning } from '@lib/hooks';

import type { NUseAnchorPositioning, TSide } from '@lib/hooks';
import type { HTMLProps } from '@lib/types';

import { useTooltipRootContext } from '../root/TooltipRootContext';

export function useTooltipPositioner(
    params: NUseTooltipPositioner.Parameters
): NUseTooltipPositioner.ReturnValue {
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

export namespace NUseTooltipPositioner {
    export type Parameters = {} & NUseAnchorPositioning.Parameters;

    export type SharedParameters = {
        side?: TSide;
    } & NUseAnchorPositioning.SharedParameters;

    export type ReturnValue = {
        props: HTMLProps;
    } & NUseAnchorPositioning.ReturnValue;
}
