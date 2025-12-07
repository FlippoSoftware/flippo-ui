import React from 'react';

import { useControlledState, useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';
import { useStableCallback } from '@flippo-ui/hooks/use-stable-callback';
import { isHTMLElement } from '@floating-ui/utils/dom';

import { useRenderElement } from '~@lib/hooks';
import { ownerDocument } from '~@lib/owner';
import { REASONS } from '~@lib/reason';
import {
    FloatingTree,
    useFloatingNodeId,
    useFloatingParentNodeId
} from '~@packages/floating-ui-react';
import { activeElement, contains } from '~@packages/floating-ui-react/utils';

import type { HeadlessUIChangeEventDetails } from '~@lib/createHeadlessUIEventDetails';
import type { HeadlessUIComponentProps } from '~@lib/types';
import type { FloatingRootContext } from '~@packages/floating-ui-react';

import { setFixedSize } from '../utils/setFixedSize';

import {
    NavigationMenuRootContext,
    NavigationMenuTreeContext,
    useNavigationMenuRootContext
} from './NavigationMenuRootContext';

import type { NavigationMenuRootContextValue } from './NavigationMenuRootContext';

const blockedReturnFocusReasons = new Set<string>([REASONS.triggerHover, REASONS.outsidePress, REASONS.focusOut]);

/**
 * Groups all parts of the navigation menu.
 * Renders a `<nav>` element at the root, or `<div>` element when nested.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuRoot(componentProps: NavigationMenuRootProps) {
    const {
        defaultValue = null,
        value: valueParam,
        onValueChange,
        actionsRef,
        delay = 50,
        closeDelay = 50,
        orientation = 'horizontal',
        onOpenChangeComplete
    } = componentProps;

    const nested = useFloatingParentNodeId() != null;

    const [value, setValueUnwrapped] = useControlledState({
        prop: valueParam,
        defaultProp: defaultValue,
        caller: 'NavigationMenuRoot'
    });

    // Derive open state from value being non-nullish
    const open = value != null;

    const closeReasonRef = React.useRef<NavigationMenuRoot.ChangeEventReason | undefined>(undefined);
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const [positionerElement, setPositionerElement] = React.useState<HTMLElement | null>(null);
    const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
    const [viewportElement, setViewportElement] = React.useState<HTMLElement | null>(null);
    const [viewportTargetElement, setViewportTargetElement] = React.useState<HTMLElement | null>(
        null
    );
    const [activationDirection, setActivationDirection]
    = React.useState<NavigationMenuRootContextValue['activationDirection']>(null);
    const [floatingRootContext, setFloatingRootContext] = React.useState<
    FloatingRootContext | undefined
    >(undefined);
    const [viewportInert, setViewportInert] = React.useState(false);

    const prevTriggerElementRef = React.useRef<Element | null | undefined>(null);
    const currentContentRef = React.useRef<HTMLDivElement | null>(null);
    const beforeInsideRef = React.useRef<HTMLSpanElement | null>(null);
    const afterInsideRef = React.useRef<HTMLSpanElement | null>(null);
    const beforeOutsideRef = React.useRef<HTMLSpanElement | null>(null);
    const afterOutsideRef = React.useRef<HTMLSpanElement | null>(null);

    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

    React.useEffect(() => {
        setViewportInert(false);
    }, [value]);

    const setValue = useStableCallback(
        (nextValue: any, eventDetails: NavigationMenuRoot.ChangeEventDetails) => {
            if (!nextValue) {
                closeReasonRef.current = eventDetails.reason;
                setActivationDirection(null);
                setFloatingRootContext(undefined);

                if (positionerElement && popupElement) {
                    setFixedSize(popupElement, 'popup');
                    setFixedSize(positionerElement, 'positioner');
                }
            }

            if (nextValue !== value) {
                onValueChange?.(nextValue, eventDetails);
            }

            if (eventDetails.isCanceled) {
                return;
            }

            setValueUnwrapped(nextValue);
        }
    );

    const handleUnmount = useStableCallback(() => {
        const doc = ownerDocument(rootRef.current);
        const activeEl = activeElement(doc);

        const isReturnFocusBlocked = closeReasonRef.current
            ? blockedReturnFocusReasons.has(closeReasonRef.current)
            : false;

        if (
            !isReturnFocusBlocked
            && isHTMLElement(prevTriggerElementRef.current)
            && (activeEl === ownerDocument(popupElement).body || contains(popupElement, activeEl))
            && popupElement
        ) {
            prevTriggerElementRef.current.focus({ preventScroll: true });
            prevTriggerElementRef.current = undefined;
        }

        setMounted(false);
        onOpenChangeComplete?.(false);
        setActivationDirection(null);
        setFloatingRootContext(undefined);

        currentContentRef.current = null;
        closeReasonRef.current = undefined;
    });

    useOpenChangeComplete({
        enabled: !actionsRef,
        open,
        ref: { current: popupElement },
        onComplete() {
            if (!open) {
                handleUnmount();
            }
        }
    });

    useOpenChangeComplete({
        enabled: !actionsRef,
        open,
        ref: { current: viewportTargetElement },
        onComplete() {
            if (!open) {
                handleUnmount();
            }
        }
    });

    const contextValue: NavigationMenuRootContextValue = React.useMemo(
        () => ({
            open,
            value,
            setValue,
            mounted,
            transitionStatus,
            positionerElement,
            setPositionerElement,
            popupElement,
            setPopupElement,
            viewportElement,
            setViewportElement,
            viewportTargetElement,
            setViewportTargetElement,
            activationDirection,
            setActivationDirection,
            floatingRootContext,
            setFloatingRootContext,
            currentContentRef,
            nested,
            rootRef,
            beforeInsideRef,
            afterInsideRef,
            beforeOutsideRef,
            afterOutsideRef,
            prevTriggerElementRef,
            delay,
            closeDelay,
            orientation,
            viewportInert,
            setViewportInert
        }),
        [
            open,
            value,
            setValue,
            mounted,
            transitionStatus,
            positionerElement,
            popupElement,
            viewportElement,
            viewportTargetElement,
            activationDirection,
            floatingRootContext,
            nested,
            delay,
            closeDelay,
            orientation,
            viewportInert
        ]
    );

    const jsx = (
        <NavigationMenuRootContext.Provider value={contextValue}>
            <TreeContext componentProps={componentProps}>
                {componentProps.children}
            </TreeContext>
        </NavigationMenuRootContext.Provider>
    );

    if (!nested) {
    // FloatingTree provides context to nested menus
        return <FloatingTree>{jsx}</FloatingTree>;
    }

    return jsx;
}

function TreeContext(props: {
    componentProps: NavigationMenuRoot.Props;
    children: React.ReactNode;
}) {
    const {
        className,
        render,
        defaultValue,
        value: valueParam,
        onValueChange,
        actionsRef,
        delay,
        closeDelay,
        orientation,
        onOpenChangeComplete,
        ref,
        ...elementProps
    } = props.componentProps;

    const nodeId = useFloatingNodeId();
    const { rootRef, nested } = useNavigationMenuRootContext();

    const { open } = useNavigationMenuRootContext();

    const state: NavigationMenuRoot.State = React.useMemo(
        () => ({
            open,
            nested
        }),
        [open, nested]
    );

    const element = useRenderElement(nested ? 'div' : 'nav', props.componentProps, {
        state,
        ref: [ref, rootRef],
        props: [{ 'aria-orientation': orientation }, elementProps]
    });

    return (
        <NavigationMenuTreeContext.Provider value={nodeId}>
            {element}
        </NavigationMenuTreeContext.Provider>
    );
}

export type NavigationMenuRootState = {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * Whether the navigation menu is nested.
     */
    nested: boolean;
};

export type NavigationMenuRootProps = {
    /**
     * A ref to imperative actions.
     */
    actionsRef?: React.RefObject<NavigationMenuRoot.Actions>;
    /**
     * Event handler called after any animations complete when the navigation menu is closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;
    /**
     * The controlled value of the navigation menu item that should be currently open.
     * When non-nullish, the menu will be open. When nullish, the menu will be closed.
     *
     * To render an uncontrolled navigation menu, use the `defaultValue` prop instead.
     * @default null
     */
    value?: any;
    /**
     * The uncontrolled value of the item that should be initially selected.
     *
     * To render a controlled navigation menu, use the `value` prop instead.
     * @default null
     */
    defaultValue?: any;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: any, eventDetails: NavigationMenuRoot.ChangeEventDetails) => void;
    /**
     * How long to wait before opening the navigation menu. Specified in milliseconds.
     * @default 50
     */
    delay?: number;
    /**
     * How long to wait before closing the navigation menu. Specified in milliseconds.
     * @default 50
     */
    closeDelay?: number;
    /**
     * The orientation of the navigation menu.
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';
} & HeadlessUIComponentProps<'nav', NavigationMenuRoot.State>;

export type NavigationMenuRootActions = {
    unmount: () => void;
};

export type NavigationMenuRootChangeEventReason
  = | typeof REASONS.triggerPress
    | typeof REASONS.triggerHover
    | typeof REASONS.outsidePress
    | typeof REASONS.listNavigation
    | typeof REASONS.focusOut
    | typeof REASONS.escapeKey
    | typeof REASONS.linkPress
    | typeof REASONS.none
    | (string & {});

export type NavigationMenuRootChangeEventDetails
  = HeadlessUIChangeEventDetails<NavigationMenuRoot.ChangeEventReason>;

export namespace NavigationMenuRoot {
    export type State = NavigationMenuRootState;
    export type Props = NavigationMenuRootProps;
    export type Actions = NavigationMenuRootActions;
    export type ChangeEventReason = NavigationMenuRootChangeEventReason;
    export type ChangeEventDetails = NavigationMenuRootChangeEventDetails;
}
