import React from 'react';

import { OPEN_DELAY } from '~@lib/constants';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks/';
import { useTriggerDataForwarding } from '~@lib/popups';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { safePolygon, useDelayGroup, useHoverReferenceInteraction } from '~@packages/floating-ui-react';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipProviderContext } from '../provider/TooltipProviderContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';

import type { TooltipHandle } from '../store/TooltipHandle';

export function TooltipTrigger(
    componentProps: TooltipTrigger.Props
) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        handle,
        payload,
        disabled: disabledProp,
        delay,
        closeDelay,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const rootContext = useTooltipRootContext(true);
    const store = handle?.store ?? rootContext;
    if (!store) {
        throw new Error(
            'Headless UI: <Tooltip.Trigger> must be either used within a <Tooltip.Root> component or provided with a handle.'
        );
    }

    const thisTriggerId = useHeadlessUiId(idProp);
    const isTriggerActive = store.useState('isTriggerActive', thisTriggerId);
    const floatingRootContext = store.useState('floatingRootContext');
    const isOpenedByThisTrigger = store.useState('isOpenedByTrigger', thisTriggerId);

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

    const delayWithDefault = delay ?? OPEN_DELAY;
    const closeDelayWithDefault = closeDelay ?? 0;

    const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(
        thisTriggerId,
        triggerElement,
        store,
        {
            payload,
            closeDelay: closeDelayWithDefault
        }
    );

    const providerContext = useTooltipProviderContext();
    const { delayRef, isInstantPhase, hasProvider } = useDelayGroup(floatingRootContext, {
        open: isOpenedByThisTrigger
    });

    store.useSyncedValue('isInstantPhase', isInstantPhase);

    const rootDisabled = store.useState('disabled');
    const disabled = disabledProp ?? rootDisabled;
    const trackCursorAxis = store.useState('trackCursorAxis');
    const disableHoverablePopup = store.useState('disableHoverablePopup');

    const hoverProps = useHoverReferenceInteraction(floatingRootContext, {
        enabled: !disabled,
        mouseOnly: true,
        move: false,
        handleClose: !disableHoverablePopup && trackCursorAxis !== 'both' ? safePolygon() : null,
        restMs() {
            const providerDelay = providerContext?.delay;
            const groupOpenValue
                = typeof delayRef.current === 'object' ? delayRef.current.open : undefined;

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
            const closeValue = typeof delayRef.current === 'object' ? delayRef.current.close : undefined;

            let computedCloseDelay: number | undefined = closeDelayWithDefault;
            if (closeDelay == null && hasProvider) {
                computedCloseDelay = closeValue;
            }

            return {
                close: computedCloseDelay
            };
        },
        triggerElement,
        isActiveTrigger: isTriggerActive
    });

    const state: TooltipTrigger.State = React.useMemo(
        () => ({ open: isOpenedByThisTrigger }),
        [isOpenedByThisTrigger]
    );

    const rootTriggerProps = store.useState('triggerProps', isMountedByThisTrigger);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, registerTrigger, setTriggerElement],
        props: [hoverProps, rootTriggerProps, { id: thisTriggerId }, elementProps],
        customStyleHookMapping: triggerOpenStateMapping
    });

    return element;
}

export type TooltipTriggerState = {
    /**
     * Whether the tooltip is currently open.
     */
    open: boolean;
};

export type TooltipTriggerProps<Payload = unknown> = {
    /**
     * A handle to associate the trigger with a tooltip.
     */
    handle?: TooltipHandle<Payload>;
    /**
     * A payload to pass to the tooltip when it is opened.
     */
    payload?: Payload;
    /**
     * How long to wait before opening the tooltip. Specified in milliseconds.
     * @default 600
     */
    delay?: number;
    /**
     * How long to wait before closing the tooltip. Specified in milliseconds.
     * @default 0
     */
    closeDelay?: number;
} & HeadlessUIComponentProps<'button', TooltipTrigger.State>;

export namespace TooltipTrigger {
    export type State = TooltipTriggerState;
    export type Props<Payload = unknown> = TooltipTriggerProps<Payload>;
}
