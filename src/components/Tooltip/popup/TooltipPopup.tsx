import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { usePopupAutoResize, useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { useHoverFloatingInteraction } from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipPositionerContext } from '../positioner/TooltipPositionerContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

const stateAttributesMapping: StateAttributesMapping<TooltipPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

export function TooltipPopup(componentProps: TooltipPopupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const store = useTooltipRootContext();
    const { side, align } = useTooltipPositionerContext();

    const open = store.useState('open');
    const mounted = store.useState('mounted');
    const instantType = store.useState('instantType');
    const transitionStatus = store.useState('transitionStatus');
    const popupProps = store.useState('popupProps');
    const payload = store.useState('payload');
    const popupElement = store.useState('popupElement');
    const positionerElement = store.useState('positionerElement');
    const floatingContext = store.useState('floatingRootContext');

    useOpenChangeComplete({
        open,
        ref: store.context.popupRef,
        onComplete() {
            if (open) {
                store.context.onOpenChangeComplete?.(true);
            }
        }
    });

    function handleMeasureLayout() {
        floatingContext.context.events.emit('measure-layout');
    }

    function handleMeasureLayoutComplete(
        previousDimensions: { width: number; height: number } | null,
        nextDimensions: { width: number; height: number }
    ) {
        floatingContext.context.events.emit('measure-layout-complete', {
            previousDimensions,
            nextDimensions
        });
    }

    // If there's just one trigger, we can skip the auto-resize logic as
    // the popover will always be anchored to the same position.
    const autoresizeEnabled = () => store.context.triggerElements.size > 1;

    usePopupAutoResize({
        popupElement,
        positionerElement,
        mounted,
        content: payload,
        enabled: autoresizeEnabled,
        onMeasureLayout: handleMeasureLayout,
        onMeasureLayoutComplete: handleMeasureLayoutComplete
    });

    const disabled = store.useState('disabled');
    const closeDelay = store.useState('closeDelay');

    useHoverFloatingInteraction(floatingContext, {
        enabled: !disabled,
        closeDelay
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
        ref: [ref, store.context.popupRef, store.useStateSetter('popupElement')],
        props: [popupProps, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type TooltipPopupState = {
    /**
     * Whether the tooltip is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    instant: 'delay' | 'focus' | 'dismiss' | undefined;
    transitionStatus: TransitionStatus;
};

export type TooltipPopupProps = {} & HeadlessUIComponentProps<'div', TooltipPopup.State>;

export namespace TooltipPopup {
    export type State = TooltipPopupState;
    export type Props = TooltipPopupProps;
}
