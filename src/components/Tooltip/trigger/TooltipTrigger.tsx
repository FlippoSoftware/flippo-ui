import React from 'react';

import { TooltipTriggerMachine } from '@flippo-software/core-components/tooltip';

import type { TooltipHandle } from '@flippo-software/core-components/tooltip';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useFloatingTree } from '~@lib/floating';
import { useHeadlessUiId, useRenderElement } from '~@lib/hooks/';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipMultipleContext } from '../multiple/TooltipMultipleContext';
import { useTooltipProviderContext } from '../provider/TooltipProviderContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';
import { multipleActive } from '../utils/stateAttributes';

const stateAttributesMapping: StateAttributesMapping<TooltipTrigger.State> = {
    ...triggerOpenStateMapping,
    multipleActive
};

export function TooltipTrigger(componentProps: TooltipTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        handle,
        payload,
        primary = false,
        disabled,
        delay,
        closeDelay,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const root = useTooltipRootContext(true);
    const store = handle?.store ?? root?.store;
    if (!store) {
        throw new Error('Headless UI: <Tooltip.Trigger> must be either used within a <Tooltip.Root> component or provided with a handle.');
    }

    const thisTriggerId = useHeadlessUiId(idProp) as string;
    const multiple = useTooltipMultipleContext();
    const provider = useTooltipProviderContext();
    const tree = useFloatingTree();

    const trigger = useMachine(
        (options) =>
            new TooltipTriggerMachine(store, options, {
                multiple,
                delayGroup: provider?.delayGroup,
                providerDelay: provider?.delay,
                tree
            }),
        { id: thisTriggerId, payload, primary, disabled, delay, closeDelay }
    );
    const track = useTracker();
    const state: TooltipTrigger.State = useMachineState(trigger);

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, (props) => track(() => toReactProps(trigger.getTriggerProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });
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
