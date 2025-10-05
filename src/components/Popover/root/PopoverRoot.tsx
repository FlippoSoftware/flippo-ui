import React from 'react';
import ReactDOM from 'react-dom';

import {
    useControlledState,
    useEventCallback,
    useOpenChangeComplete,
    useOpenInteractionType,
    useScrollLock,
    useTimeout,
    useTransitionStatus
} from '@flippo-ui/hooks';
import { OPEN_DELAY, PATIENT_CLICK_THRESHOLD } from '~@lib/constants';
import { mergeProps } from '~@lib/merge';
import {
    FloatingTree,
    safePolygon,
    useClick,
    useDismiss,
    useFloatingParentNodeId,
    useFloatingRootContext,
    useHover,
    useInteractions,
    useRole
} from '~@packages/floating-ui-react';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { FloatingUIOpenChangeDetails } from '~@lib/types';

import {
    PopoverRootContext,
    usePopoverRootContext
} from './PopoverRootContext';

import type {
    PopoverRootContextValue
} from './PopoverRootContext';

function PopoverRootComponent({ props }: { props: PopoverRoot.Props }) {
    const {
        open: externalOpen,
        onOpenChange,
        defaultOpen = false,
        delay = OPEN_DELAY,
        closeDelay = 0,
        openOnHover = false,
        onOpenChangeComplete,
        modal = false
    } = props;

    const [instantType, setInstantType] = React.useState<'dismiss' | 'click'>();
    const [titleId, setTitleId] = React.useState<string>();
    const [descriptionId, setDescriptionId] = React.useState<string>();
    const [triggerElement, setTriggerElement] = React.useState<Element | null>(null);
    const [positionerElement, setPositionerElement] = React.useState<HTMLElement | null>(null);
    const [openReason, setOpenReason] = React.useState<PopoverRoot.ChangeEventReason | null>(null);
    const [stickIfOpen, setStickIfOpen] = React.useState(true);
    const backdropRef = React.useRef<HTMLDivElement | null>(null);
    const internalBackdropRef = React.useRef<HTMLDivElement | null>(null);

    const popupRef = React.useRef<HTMLElement>(null);
    const stickIfOpenTimeout = useTimeout();

    const nested = useFloatingParentNodeId() != null;

    let floatingEvents: ReturnType<typeof useFloatingRootContext>['events'];

    const [open, setOpenUnwrapped] = useControlledState({
        prop: externalOpen,
        defaultProp: defaultOpen,
        caller: 'Popover'
    });

    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
    const {
        openMethod,
        triggerProps,
        reset: resetOpenInteractionType
    } = useOpenInteractionType(open);

    const handleUnmount = useEventCallback(() => {
        setMounted(false);
        setStickIfOpen(true);
        setOpenReason(null);
        onOpenChangeComplete?.(false);
        resetOpenInteractionType();
    });

    useOpenChangeComplete({
        enabled: !props.actionsRef,
        open,
        ref: popupRef,
        onComplete() {
            if (!open) {
                handleUnmount();
            }
        }
    });

    React.useImperativeHandle(props.actionsRef, () => ({ unmount: handleUnmount }), [handleUnmount]);

    React.useEffect(() => {
        if (!open) {
            stickIfOpenTimeout.clear();
        }
    }, [stickIfOpenTimeout, open]);

    const setOpen = useEventCallback(
        (nextOpen: boolean, eventDetails: PopoverRoot.ChangeEventDetails) => {
            const isHover = eventDetails.reason === 'trigger-hover';
            const isKeyboardClick
                = eventDetails.reason === 'trigger-press' && (eventDetails.event as MouseEvent).detail === 0;
            const isDismissClose
                = !nextOpen && (eventDetails.reason === 'escape-key' || eventDetails.reason === 'none');

            onOpenChange?.(nextOpen, eventDetails);

            if (eventDetails.isCanceled) {
                return;
            }

            const details: FloatingUIOpenChangeDetails = {
                open: nextOpen,
                nativeEvent: eventDetails.event,
                reason: eventDetails.reason,
                nested
            };

            floatingEvents?.emit('openchange', details);

            function changeState() {
                setOpenUnwrapped(nextOpen);

                if (nextOpen) {
                    setOpenReason(eventDetails.reason);
                }
            }

            if (isHover) {
                // Only allow "patient" clicks to close the popover if it's open.
                // If they clicked within 500ms of the popover opening, keep it open.
                setStickIfOpen(true);
                stickIfOpenTimeout.start(PATIENT_CLICK_THRESHOLD, () => {
                    setStickIfOpen(false);
                });

                ReactDOM.flushSync(changeState);
            }
            else {
                changeState();
            }

            if (isKeyboardClick || isDismissClose) {
                setInstantType(isKeyboardClick ? 'click' : 'dismiss');
            }
            else {
                setInstantType(undefined);
            }
        }
    );

    const floatingContext = useFloatingRootContext({
        elements: {
            reference: triggerElement,
            floating: positionerElement
        },
        open,
        onOpenChange: setOpen
    });

    floatingEvents = floatingContext.events;

    useScrollLock({
        enabled: open && modal === true && openReason !== 'trigger-hover' && openMethod !== 'touch',
        mounted,
        open,
        referenceElement: positionerElement
    });

    const computedRestMs = delay;

    const hover = useHover(floatingContext, {
        enabled: openOnHover && (openMethod !== 'touch' || openReason !== 'trigger-press'),
        mouseOnly: true,
        move: false,
        handleClose: safePolygon({ blockPointerEvents: true }),
        restMs: computedRestMs,
        delay: {
            close: closeDelay
        }
    });
    const click = useClick(floatingContext, {
        stickIfOpen
    });
    const dismiss = useDismiss(floatingContext, {
        outsidePressEvent: {
            // Ensure `aria-hidden` on outside elements is removed immediately
            // on outside press when trapping focus.
            mouse: modal === 'trap-focus' ? 'sloppy' : 'intentional',
            touch: 'sloppy'
        }
    });
    const role = useRole(floatingContext);

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        click,
        dismiss,
        role
    ]);

    const popoverContext: PopoverRootContextValue = React.useMemo(
        () => ({
            open,
            setOpen,
            mounted,
            setMounted,
            transitionStatus,
            triggerElement,
            setTriggerElement,
            positionerElement,
            setPositionerElement,
            popupRef,
            titleId,
            setTitleId,
            descriptionId,
            setDescriptionId,
            backdropRef,
            internalBackdropRef,
            triggerProps: mergeProps(getReferenceProps(), triggerProps),
            popupProps: getFloatingProps(),
            floatingRootContext: floatingContext,
            instantType,
            openMethod,
            openReason,
            onOpenChangeComplete,
            openOnHover,
            delay,
            closeDelay,
            modal
        }),
        [
            open,
            setOpen,
            mounted,
            setMounted,
            transitionStatus,
            positionerElement,
            titleId,
            descriptionId,
            getReferenceProps,
            triggerElement,
            triggerProps,
            getFloatingProps,
            floatingContext,
            instantType,
            openMethod,
            openReason,
            onOpenChangeComplete,
            openOnHover,
            delay,
            closeDelay,
            modal
        ]
    );

    return (
        <PopoverRootContext.Provider value={popoverContext}>
            {props.children}
        </PopoverRootContext.Provider>
    );
}

/**
 * Groups all parts of the popover.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverRoot(props: PopoverRoot.Props) {
    if (usePopoverRootContext(true)) {
        return <PopoverRootComponent props={props} />;
    }

    return (
        <FloatingTree>
            <PopoverRootComponent props={props} />
        </FloatingTree>
    );
}

export namespace PopoverRoot {
    export type State = object;

    type Parameters = {
        /**
         * Whether the popover is initially open.
         *
         * To render a controlled popover, use the `open` prop instead.
         * @default false
         */
        defaultOpen?: boolean;
        /**
         * Whether the popover is currently open.
         */
        open?: boolean;
        /**
         * Event handler called when the popover is opened or closed.
         */
        onOpenChange?: (open: boolean, eventDetails: ChangeEventDetails) => void;
        /**
         * Event handler called after any animations complete when the popover is opened or closed.
         */
        onOpenChangeComplete?: (open: boolean) => void;
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
        /**
         * A ref to imperative actions.
         * - `unmount`: When specified, the popover will not be unmounted when closed.
         * Instead, the `unmount` function must be called to unmount the popover manually.
         * Useful when the popover's animation is controlled by an external library.
         */
        actionsRef?: React.RefObject<Actions>;
        /**
         * Determines if the popover enters a modal state when open.
         * - `true`: user interaction is limited to the popover: document page scroll is locked,
         *    and pointer interactions on outside elements are disabled.
         * - `false`: user interaction with the rest of the document is allowed.
         * - `'trap-focus'`: focus is trapped inside the popover, but document page scroll is not locked
         *    and pointer interactions outside of it remain enabled.
         * @default false
         */
        modal?: boolean | 'trap-focus';
    };

    export type Props = {
        children?: React.ReactNode;
    } & Parameters;

    export type Actions = {
        unmount: () => void;
    };

    export type ChangeEventReason
        = | 'trigger-hover'
          | 'trigger-focus'
          | 'trigger-press'
          | 'outside-press'
          | 'escape-key'
          | 'close-press'
          | 'focus-out'
          | 'none';
    export type ChangeEventDetails = HeadlessUIChangeEventDetails<ChangeEventReason>;
}
