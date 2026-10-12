import React from 'react';

import { PopoverTriggerMachine } from '@flippo-software/core-components/popover';

import type { PopoverHandle } from '@flippo-software/core-components/popover';

import { toReactProps, useMachine, useMachineState, useStoreSelector, useTracker } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { useFloatingTree } from '~@lib/floating';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { pressableTriggerOpenStateMapping, triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';
import { OPEN_DELAY } from '../utils/constants';

/**
 * A button that opens the popover.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverTrigger(componentProps: PopoverTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        handle,
        payload,
        openOnHover = false,
        delay = OPEN_DELAY,
        closeDelay = 0,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const rootContext = usePopoverRootContext(true);
    const store = handle?.store ?? rootContext?.store;
    if (!store) {
        throw new Error('Base UI: <Popover.Trigger> must be either used within a <Popover.Root> component or provided with a handle.');
    }

    const thisTriggerId = useHeadlessUiId(idProp) as string;
    const tree = useFloatingTree();

    const trigger = useMachine((options) => new PopoverTriggerMachine(store, options), {
        id: thisTriggerId,
        disabled,
        nativeButton,
        payload,
        openOnHover,
        delay,
        closeDelay,
        tree
    });
    const track = useTracker();
    const state: PopoverTrigger.State = useMachineState(trigger);
    const openReason = useStoreSelector(store, 'openChangeReason');

    const stateAttributesMapping: StateAttributesMapping<{ open: boolean }> = React.useMemo(
        () => ({
            open(value) {
                if (value && openReason === REASONS.triggerPress) {
                    return pressableTriggerOpenStateMapping.open(value);
                }

                return triggerOpenStateMapping.open(value);
            }
        }),
        [openReason]
    );

    const element = useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, (props) => track(() => toReactProps(trigger.getTriggerProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    // A fragment with key is required to ensure that the `element` is mounted to the same DOM node
    // regardless of whether the focus guards are rendered or not.
    if (track(() => trigger.isActive())) {
        return (
            <React.Fragment>
                <FocusGuard ref={trigger.setPreFocusGuard} onFocus={trigger.onPreFocusGuardFocus} />
                <React.Fragment key={thisTriggerId}>{element}</React.Fragment>
                <FocusGuard ref={trigger.setFocusTarget} onFocus={trigger.onFocusTargetFocus} />
            </React.Fragment>
        );
    }

    return <React.Fragment key={thisTriggerId}>{element}</React.Fragment>;
}

export type PopoverTriggerState = {
    /**
     * Whether the popover is currently disabled.
     */
    disabled: boolean;
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
};

export type PopoverTriggerProps<Payload = unknown> = NativeButtonProps &
    HeadlessUIComponentProps<'button', PopoverTriggerState> & {
        /**
         * Whether the component renders a native `<button>` element when replacing it
         * via the `render` prop.
         * Set to `false` if the rendered element is not a button (e.g. `<div>`).
         * @default true
         */
        nativeButton?: boolean;
        /**
         * A handle to associate the trigger with a popover.
         */
        handle?: PopoverHandle<Payload>;
        /**
         * A payload to pass to the popover when it is opened.
         */
        payload?: Payload;
        /**
         * ID of the trigger. In addition to being forwarded to the rendered element,
         * it is also used to specify the active trigger for the popover in controlled mode (with the PopoverRoot `triggerId` prop).
         */
        id?: string;
        /**
         * Whether the popover should also open when the trigger is hovered.
         * @default false
         */
        openOnHover?: boolean;
        /**
         * How long to wait before the popover may be opened on hover. Specified in milliseconds.
         *
         * Requires the `openOnHover` prop.
         * @default 300
         */
        delay?: number;
        /**
         * How long to wait before closing the popover that was opened on hover.
         * Specified in milliseconds.
         *
         * Requires the `openOnHover` prop.
         * @default 0
         */
        closeDelay?: number;
    };

export namespace PopoverTrigger {
    export type State = PopoverTriggerState;
    export type Props<Payload = unknown> = PopoverTriggerProps<Payload>;
}
