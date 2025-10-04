'use client';

import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { DISABLED_TRANSITIONS_STYLE, EMPTY_OBJECT } from '@lib/constants';
import { useRenderElement } from '@lib/hooks';
import { popupStateMapping as baseMapping } from '@lib/popupStateMapping';
import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { TAlign, TSide } from '@lib/hooks';
import type { HeadlessUIComponentProps } from '@lib/types';

import { useTooltipPositionerContext } from '../positioner/TooltipPositionerContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

const customStyleHookMapping: CustomStyleHookMapping<TooltipPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

export function TooltipPopup(componentProps: TooltipPopup.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const {
        open,
        instantType,
        transitionStatus,
        popupProps,
        popupRef,
        onOpenChangeComplete
    }
        = useTooltipRootContext();
    const { side, align } = useTooltipPositionerContext();

    useOpenChangeComplete({
        open,
        ref: popupRef,
        onComplete() {
            if (open) {
                onOpenChangeComplete?.(true);
            }
        }
    });

    const state: TooltipPopup.State = React.useMemo(
        () => ({
            open,
            side,
            align,
            instant: instantType,
            transitionStatus
        }),
        [
            open,
            side,
            align,
            instantType,
            transitionStatus
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, popupRef],
        props: [popupProps, transitionStatus === 'starting' ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT, elementProps],
        customStyleHookMapping
    });

    return element;
}

export namespace TooltipPopup {
    export type State = {
        open: boolean;
        side: TSide;
        align: TAlign;
        instant: 'delay' | 'focus' | 'dismiss' | undefined;
        transitionStatus: TransitionStatus;
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
