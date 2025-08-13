'use client';

import React from 'react';
import ReactDOM from 'react-dom';

import {
    useControlledState,
    useEventCallback,
    useOpenChangeComplete,
    useTransitionStatus
} from '@flippo_ui/hooks';
import {
    safePolygon,
    useClientPoint,
    useDismiss,
    useFloatingRootContext,
    useFocus,
    useHover,
    useInteractions,
    useNextDelayGroup
} from '@floating-ui/react';

import type { TransitionStatus } from '@flippo_ui/hooks';
import type { FloatingRootContext } from '@floating-ui/react';

import { OPEN_DELAY } from '@lib/constants';
import { translateOpenChangeReason } from '@lib/translateOpenChangeReason';

import type { TBaseOpenChangeReason } from '@lib/translateOpenChangeReason';
import type { HTMLProps } from '@lib/types';

import { useTooltipProviderContext } from '../provider/TooltipProviderContext';

export type TTooltipOpenChangeReason = TBaseOpenChangeReason | 'disabled';

export function useTooltipRoot(params: NUseTooltipRoot.Params): NUseTooltipRoot.ReturnValue {
    const {
        open: externalOpen,
        defaultOpen = false,
        hoverable = true,
        trackCursorAxis = 'none',
        delay,
        closeDelay,
        disabled,
        onOpenChangeComplete,
        onOpenChange: onOpenChangeProp
    } = params;

    const delayWithDefault = delay ?? OPEN_DELAY;
    const closeDelayWithDefault = closeDelay ?? 0;

    const [triggerElement, setTriggerElement] = React.useState<Element | null>(null);
    const [positionerElement, setPositionerElement] = React.useState<HTMLElement | null>(null);
    const [instantTypeState, setInstantTypeState] = React.useState<'dismiss' | 'focus'>();

    const popupRef = React.useRef<HTMLElement>(null);

    const [open, setOpenUnwrapped] = useControlledState({ prop: externalOpen, defaultProp: defaultOpen, caller: 'useTooltipRoot' });

    const onOpenChange = useEventCallback(onOpenChangeProp);

    const setOpen = React.useCallback((nextOpen: boolean, event: Event | undefined, reason: TTooltipOpenChangeReason | undefined) => {
        const isHover = reason === 'trigger-hover';
        const isFocusOpen = nextOpen && reason === 'trigger-focus';
        const isDismissClose = !nextOpen && (reason === 'trigger-press' || reason === 'escape-key');

        function changeState() {
            setOpenUnwrapped(nextOpen);
            onOpenChange(nextOpen, event, reason);
        }

        if (isHover) {
            ReactDOM.flushSync(changeState);
        }
        else {
            changeState();
        }

        if (isFocusOpen || isDismissClose) {
            setInstantTypeState(isFocusOpen ? 'focus' : 'dismiss');
        }
        else if (reason === 'trigger-hover') {
            setInstantTypeState(undefined);
        }
    }, [onOpenChange, setOpenUnwrapped]);

    if (open && disabled) {
        setOpen(false, undefined, 'disabled');
    }

    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

    const handleUnmount = useEventCallback(() => {
        setMounted(false);
        onOpenChangeComplete?.(false);
    });

    useOpenChangeComplete({
        enabled: !params.actionsRef,
        open,
        ref: popupRef,
        onComplete() {
            if (!open) {
                handleUnmount();
            }
        }
    });

    React.useImperativeHandle(params.actionsRef, () => ({ unmount: handleUnmount }), [handleUnmount]);

    const context = useFloatingRootContext({
        elements: {
            reference: triggerElement,
            floating: positionerElement
        },
        open,
        onOpenChange(openValue, eventValue, reasonValue) {
            setOpen(openValue, eventValue, translateOpenChangeReason(reasonValue));
        }
    });

    const providerContext = useTooltipProviderContext();
    const { delayRef, isInstantPhase, hasProvider } = useNextDelayGroup(context);

    const instantType = isInstantPhase ? ('delay' as const) : instantTypeState;

    const hover = useHover(context, {
        enabled: !disabled,
        mouseOnly: true,
        move: false,
        handleClose: hoverable && trackCursorAxis !== 'both' ? safePolygon() : null,
        restMs() {
            const providerDelay = providerContext?.delay;
            const groupOpenValue = typeof delayRef.current === 'object' ? delayRef.current.open : undefined;

            let computedRestMs = delayWithDefault;
            if (hasProvider) {
                if (groupOpenValue !== 0) {
                    computedRestMs = delay ?? providerDelay ?? delayWithDefault;
                }
                else {
                    computedRestMs = 0;
                }
            }

            return computedRestMs;
        },
        delay() {
            let computedCloseDelay: number | undefined = closeDelayWithDefault;
            if (closeDelay == null && hasProvider) {
                computedCloseDelay = typeof delayRef.current === 'object' ? delayRef.current.close : undefined;
            }

            return {
                close: computedCloseDelay
            };
        }
    });
    const focus = useFocus(context, { enabled: !disabled });
    const dismiss = useDismiss(context, { enabled: !disabled, referencePress: true });
    const clientPoint = useClientPoint(context, {
        enabled: !disabled && trackCursorAxis !== 'none',
        axis: trackCursorAxis === 'none' ? undefined : trackCursorAxis
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        clientPoint
    ]);

    return React.useMemo(
        () => ({
            open,
            setOpen,
            mounted,
            setMounted,
            setTriggerElement,
            positionerElement,
            setPositionerElement,
            popupRef,
            delay: delayWithDefault,
            closeDelay: closeDelayWithDefault,
            hoverable,
            trackCursorAxis,
            triggerProps: getReferenceProps(),
            popupProps: getFloatingProps(),
            floatingRootContext: context,
            instantType,
            transitionStatus,
            onOpenChangeComplete
        }),
        [
            open,
            setOpen,
            mounted,
            setMounted,
            positionerElement,
            delayWithDefault,
            closeDelayWithDefault,
            hoverable,
            trackCursorAxis,
            getReferenceProps,
            getFloatingProps,
            context,
            instantType,
            transitionStatus,
            onOpenChangeComplete
        ]
    );
}

export namespace NUseTooltipRoot {
    export type Params = {
        defaultOpen?: boolean;
        open?: boolean;
        onOpenChange?: (
            open: boolean,
            event: Event | undefined,
            reason: TTooltipOpenChangeReason | undefined,
        ) => void;
        onOpenChangeComplete?: (open: boolean) => void;
        hoverable?: boolean;
        trackCursorAxis?: 'none' | 'x' | 'y' | 'both';
        delay?: number;
        closeDelay?: number;
        actionsRef?: React.RefObject<Actions>;
        disabled?: boolean;
    };

    export type ReturnValue = {
        open: boolean;
        setOpen: (
            open: boolean,
            event: Event | undefined,
            reason: TTooltipOpenChangeReason | undefined,
        ) => void;
        mounted: boolean;
        setMounted: React.Dispatch<React.SetStateAction<boolean>>;
        triggerProps: HTMLProps;
        popupProps: HTMLProps;
        floatingRootContext: FloatingRootContext;
        instantType: 'delay' | 'dismiss' | 'focus' | undefined;
        transitionStatus: TransitionStatus;
        positionerElement: HTMLElement | null;
        setTriggerElement: React.Dispatch<React.SetStateAction<Element | null>>;
        setPositionerElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
        popupRef: React.RefObject<HTMLElement | null>;
        delay: number;
        closeDelay: number;
        hoverable: boolean;
        trackCursorAxis: 'none' | 'x' | 'y' | 'both';
        onOpenChangeComplete: ((open: boolean) => void) | undefined;
    };

    export type Actions = {
        unmount: () => void;
    };
}
