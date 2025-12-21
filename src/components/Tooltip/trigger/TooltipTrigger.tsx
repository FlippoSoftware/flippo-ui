import React from 'react';

import { useIsoLayoutEffect } from '@flippo-ui/hooks/use-iso-layout-effect';

import { OPEN_DELAY } from '~@lib/constants';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks/';
import { useTriggerDataForwarding } from '~@lib/popups';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { safePolygon, useDelayGroup, useHoverReferenceInteraction } from '~@packages/floating-ui-react';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { multipleSafePolygon } from '../multiple/multipleSafePolygon';
import { useTooltipMultipleContext } from '../multiple/TooltipMultipleContext';
import { useTooltipProviderContext } from '../provider/TooltipProviderContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';
import { multipleActive } from '../utils/stateAttributes';

import type { TooltipHandle } from '../store/TooltipHandle';

const stateAttributesMapping: StateAttributesMapping<TooltipTrigger.State> = {
    ...triggerOpenStateMapping,
    multipleActive
};

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
        primary = false,
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

    const multipleItemIndex = store.useState('multipleItemIndex');

    // Register this trigger as primary if marked
    useIsoLayoutEffect(() => {
        if (!primary || !thisTriggerId) {
            return;
        }

        const currentPrimaryId = store.select('primaryTriggerId');

        // First wins strategy: if there's already a primary, warn and ignore
        if (currentPrimaryId !== null && currentPrimaryId !== thisTriggerId) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    `[Tooltip] Multiple triggers marked as primary. `
                    + `Trigger "${currentPrimaryId}" is already primary. `
                    + `Ignoring primary on trigger "${thisTriggerId}".`
                );
            }
            return;
        }

        store.set('primaryTriggerId', thisTriggerId);

        // Cleanup: reset if this trigger unmounts
        return () => {
            if (store.select('primaryTriggerId') === thisTriggerId) {
                store.set('primaryTriggerId', null);
            }
        };
    }, [primary, store, thisTriggerId]);

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

    const providerContext = useTooltipProviderContext();
    const multipleContext = useTooltipMultipleContext();

    // Priority: trigger prop > multiple context > provider context > default
    const effectiveDelay = delay ?? multipleContext?.delay ?? OPEN_DELAY;
    const effectiveCloseDelay = closeDelay ?? multipleContext?.closeDelay ?? 0;

    const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(
        thisTriggerId,
        triggerElement,
        store,
        {
            payload,
            closeDelay: effectiveCloseDelay
        }
    );

    // Disable delay group when inside Multiple to allow all tooltips open simultaneously
    const { delayRef, isInstantPhase, hasProvider } = useDelayGroup(floatingRootContext, {
        enabled: !multipleContext,
        open: isOpenedByThisTrigger
    });

    store.useSyncedValue('isInstantPhase', isInstantPhase);

    const rootDisabled = store.useState('disabled');
    // Priority: trigger prop > multiple context > root prop
    const disabled = disabledProp ?? multipleContext?.disabled ?? rootDisabled;
    const trackCursorAxis = store.useState('trackCursorAxis');
    const disableHoverablePopup = store.useState('disableHoverablePopup');

    // Use multipleSafePolygon for Multiple, regular safePolygon otherwise
    const handleClose = React.useMemo(() => {
        if (disableHoverablePopup || trackCursorAxis === 'both') {
            return null;
        }

        if (multipleContext) {
            return multipleSafePolygon(multipleContext.store);
        }

        return safePolygon();
    }, [disableHoverablePopup, trackCursorAxis, multipleContext]);

    const hoverProps = useHoverReferenceInteraction(floatingRootContext, {
        enabled: !disabled,
        mouseOnly: true,
        move: false,
        handleClose,
        restMs() {
            const providerDelay = providerContext?.delay;
            const groupOpenValue
                = typeof delayRef.current === 'object' ? delayRef.current.open : undefined;

            let computedRestMs = effectiveDelay;
            if (hasProvider && !multipleContext) {
                if (groupOpenValue !== 0) {
                    computedRestMs = delay ?? providerDelay ?? effectiveDelay;
                }
                else {
                    computedRestMs = 0;
                }
            }

            return computedRestMs;
        },
        delay() {
            const closeValue = typeof delayRef.current === 'object' ? delayRef.current.close : undefined;

            let computedCloseDelay: number | undefined = effectiveCloseDelay;
            if (closeDelay == null && hasProvider && !multipleContext) {
                computedCloseDelay = closeValue;
            }

            return {
                close: computedCloseDelay
            };
        },
        triggerElement,
        isActiveTrigger: isTriggerActive
    });

    useIsoLayoutEffect(() => {
        if (!triggerElement || !multipleContext || multipleItemIndex == null || multipleItemIndex < 0)
            return;

        const onSetActive = () => {
            multipleContext.store.set('activeIndex', multipleItemIndex);
        };

        const onSetInactive = () => {
            multipleContext.store.set('activeIndex', null);
        };

        triggerElement.addEventListener('mouseenter', onSetActive);
        triggerElement.addEventListener('mouseleave', onSetInactive);
        triggerElement.addEventListener('focus', onSetActive);
        triggerElement.addEventListener('blur', onSetInactive);

        return () => {
            triggerElement.removeEventListener('mouseenter', onSetActive);
            triggerElement.removeEventListener('mouseleave', onSetInactive);
            triggerElement.removeEventListener('focus', onSetActive);
            triggerElement.removeEventListener('blur', onSetInactive);
        };
    }, [triggerElement, multipleItemIndex, store]);

    const multipleActive = store.useMultipleActive();

    const state: TooltipTrigger.State = React.useMemo(
        () => ({ open: isOpenedByThisTrigger, multipleActive }),
        [isOpenedByThisTrigger, multipleActive]
    );

    const rootTriggerProps = store.useState('triggerProps', isMountedByThisTrigger);

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, registerTrigger, setTriggerElement],
        props: [hoverProps, rootTriggerProps, {
            id: thisTriggerId
        }, elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type TooltipTriggerState = {
    /**
     * Whether the tooltip is currently open.
     */
    open: boolean;
    /**
     * Whether the tooltip is currently active in the multiple context.
     */
    multipleActive: boolean;
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
     * Marks this trigger as the primary trigger for positioning.
     * Used when the tooltip is opened via TooltipMultiple sync.
     * If multiple triggers are marked as primary, the first one wins.
     * @default false
     */
    primary?: boolean;
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
