import React from 'react';
import ReactDOM from 'react-dom';

import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';

import type { FocusableElement } from 'tabbable';

import { CLICK_TRIGGER_IDENTIFIER } from '~@lib/constants';
import { createChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import { FocusGuard } from '~@lib/FocusGuard';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { useTriggerDataForwarding } from '~@lib/popups';
import {
    pressableTriggerOpenStateMapping,
    triggerOpenStateMapping
} from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
import {
    safePolygon,
    useClick,
    useHoverReferenceInteraction,
    useInteractions
} from '~@packages/floating-ui-react';
import {
    contains,
    getNextTabbable,
    getTabbableAfterElement,
    getTabbableBeforeElement,
    isOutsideEvent
} from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useButton } from '../../use-button/useButton';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { OPEN_DELAY } from '../utils/constants';

import type { PopoverHandle } from '../store/PopoverHandle';

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
        throw new Error(
            'Base UI: <Popover.Trigger> must be either used within a <Popover.Root> component or provided with a handle.'
        );
    }

    const thisTriggerId = useHeadlessUiId(idProp);
    const isTriggerActive = store.useState('isTriggerActive', thisTriggerId);
    const floatingContext = store.useState('floatingRootContext');
    const isOpenedByThisTrigger = store.useState('isOpenedByTrigger', thisTriggerId);

    const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

    const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(
        thisTriggerId,
        triggerElement,
        store,
        {
            payload,
            disabled,
            openOnHover,
            closeDelay
        }
    );

    const openReason = store.useState('openChangeReason');
    const stickIfOpen = store.useState('stickIfOpen');
    const openMethod = store.useState('openMethod');

    const hoverProps = useHoverReferenceInteraction(floatingContext, {
        enabled:
      floatingContext != null
      && openOnHover
      && (openMethod !== 'touch' || openReason !== REASONS.triggerPress),
        mouseOnly: true,
        move: false,
        handleClose: safePolygon(),
        restMs: delay,
        delay: {
            close: closeDelay
        },
        triggerElement,
        isActiveTrigger: isTriggerActive
    });

    const click = useClick(floatingContext, { enabled: floatingContext != null, stickIfOpen });

    const localProps = useInteractions([click]);

    const rootTriggerProps = store.useState('triggerProps', isMountedByThisTrigger);

    const state: PopoverTrigger.State = React.useMemo(
        () => ({
            disabled,
            open: isOpenedByThisTrigger
        }),
        [disabled, isOpenedByThisTrigger]
    );

    const { getButtonProps, buttonRef } = useButton({
        disabled,
        native: nativeButton
    });

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
        ref: [buttonRef, ref, registerTrigger, setTriggerElement],
        props: [
            localProps.getReferenceProps(),
            hoverProps,
            rootTriggerProps,
            { [CLICK_TRIGGER_IDENTIFIER as string]: '', id: thisTriggerId },
            elementProps,
            getButtonProps
        ],
        customStyleHookMapping: stateAttributesMapping
    });

    const preFocusGuardRef = React.useRef<HTMLElement>(null);

    const handlePreFocusGuardFocus = useStableCallback((event: React.FocusEvent) => {
        ReactDOM.flushSync(() => {
            store.setOpen(
                false,
                createChangeEventDetails(
                    REASONS.focusOut,
                    event.nativeEvent,
                    event.currentTarget as HTMLElement
                )
            );
        });

        const previousTabbable: FocusableElement | null = getTabbableBeforeElement(
            preFocusGuardRef.current
        );
        previousTabbable?.focus();
    });

    const handleFocusTargetFocus = useStableCallback((event: React.FocusEvent) => {
        const positionerElement = store.select('positionerElement');
        if (positionerElement && isOutsideEvent(event, positionerElement)) {
            store.context.beforeContentFocusGuardRef.current?.focus();
        }
        else {
            ReactDOM.flushSync(() => {
                store.setOpen(
                    false,
                    createChangeEventDetails(
                        REASONS.focusOut,
                        event.nativeEvent,
                        event.currentTarget as HTMLElement
                    )
                );
            });

            let nextTabbable = getTabbableAfterElement(triggerElement);

            while (
                (nextTabbable !== null && contains(positionerElement, nextTabbable))
                || nextTabbable?.hasAttribute('aria-hidden')
            ) {
                const prevTabbable = nextTabbable;
                nextTabbable = getNextTabbable(nextTabbable);
                if (nextTabbable === prevTabbable) {
                    break;
                }
            }

            nextTabbable?.focus();
        }
    });

    // A fragment with key is required to ensure that the `element` is mounted to the same DOM node
    // regardless of whether the focus guards are rendered or not.

    if (isTriggerActive) {
        return (
            <React.Fragment>
                <FocusGuard ref={preFocusGuardRef} onFocus={handlePreFocusGuardFocus} />
                <React.Fragment key={thisTriggerId}>{element}</React.Fragment>
                <FocusGuard ref={store.context.triggerFocusTargetRef} onFocus={handleFocusTargetFocus} />
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

export type PopoverTriggerProps<Payload = unknown> = NativeButtonProps
  & HeadlessUIComponentProps<'button', PopoverTriggerState> & {
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
