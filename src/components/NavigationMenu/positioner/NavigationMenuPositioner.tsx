import React from 'react';
import ReactDOM from 'react-dom';

import { useTimeout } from '@flippo-ui/hooks';

import { adaptiveOrigin } from '~@lib/adaptiveOriginMiddleware';
import { DROPDOWN_COLLISION_AVOIDANCE, POPUP_COLLISION_AVOIDANCE } from '~@lib/constants';
import { getDisabledMountTransitionStyles } from '~@lib/getDisabledMountTransitionStyles';
import { useAnchorPositioning, useRenderElement } from '~@lib/hooks';
import { ownerWindow } from '~@lib/owner';
import { popupStateMapping } from '~@lib/popupStateMapping';
import {
    disableFocusInside,
    enableFocusInside,
    isOutsideEvent
} from '~@packages/floating-ui-react/utils';
import { getEmptyRootContext } from '~@packages/floating-ui-react/utils/getEmptyRootContext';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPortalContext } from '../portal/NavigationMenuPortalContext';
import {
    useNavigationMenuRootContext,
    useNavigationMenuTreeContext
} from '../root/NavigationMenuRootContext';

import { NavigationMenuPositionerContext } from './NavigationMenuPositionerContext';

const EMPTY_ROOT_CONTEXT = getEmptyRootContext();

/**
 * Positions the navigation menu against the currently active trigger.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuPositioner(componentProps: NavigationMenuPositionerProps) {
    const {
        open,
        mounted,
        positionerElement,
        setPositionerElement,
        floatingRootContext,
        nested,
        transitionStatus
    } = useNavigationMenuRootContext();

    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        collisionAvoidance = nested ? POPUP_COLLISION_AVOIDANCE : DROPDOWN_COLLISION_AVOIDANCE,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        ...elementProps
    } = componentProps;

    const keepMounted = useNavigationMenuPortalContext();
    const nodeId = useNavigationMenuTreeContext();

    const resizeTimeout = useTimeout();

    const [instant, setInstant] = React.useState(false);

    const positionerRef = React.useRef<HTMLDivElement | null>(null);
    const prevTriggerElementRef = React.useRef<Element | null>(null);

    // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
    React.useEffect(() => {
        if (!positionerElement) {
            return undefined;
        }

        // Make sure elements inside the portal element are tabbable only when the
        // portal has already been focused, either by tabbing into a focus trap
        // element outside or using the mouse.
        function onFocus(event: FocusEvent) {
            if (positionerElement && isOutsideEvent(event)) {
                const focusing = event.type === 'focusin';
                const manageFocus = focusing ? enableFocusInside : disableFocusInside;
                manageFocus(positionerElement);
            }
        }

        // Listen to the event on the capture phase so they run before the focus
        // trap elements onFocus prop is called.
        positionerElement.addEventListener('focusin', onFocus, true);
        positionerElement.addEventListener('focusout', onFocus, true);
        return () => {
            positionerElement.removeEventListener('focusin', onFocus, true);
            positionerElement.removeEventListener('focusout', onFocus, true);
        };
    }, [positionerElement]);

    const domReference = (floatingRootContext || EMPTY_ROOT_CONTEXT).useState('domReferenceElement');

    const positioning = useAnchorPositioning({
        anchor: anchor ?? domReference ?? prevTriggerElementRef,
        positionMethod,
        mounted,
        side,
        sideOffset,
        align,
        alignOffset,
        arrowPadding,
        collisionBoundary,
        collisionPadding,
        sticky,
        disableAnchorTracking,
        keepMounted,
        floatingRootContext,
        collisionAvoidance,
        nodeId,
        // Allows the menu to remain anchored without wobbling while its size
        // and position transition simultaneously when side=top or side=left.
        adaptiveOrigin
    });

    const defaultProps: React.ComponentProps<'div'> = React.useMemo(() => {
        const hiddenStyles: React.CSSProperties = {};

        if (!open) {
            hiddenStyles.pointerEvents = 'none';
        }

        return {
            role: 'presentation',
            hidden: !mounted,
            style: {
                ...positioning.positionerStyles,
                ...hiddenStyles
            }
        };
    }, [open, mounted, positioning.positionerStyles]);

    const state: NavigationMenuPositioner.State = React.useMemo(
        () => ({
            open,
            side: positioning.side,
            align: positioning.align,
            anchorHidden: positioning.anchorHidden,
            instant
        }),
        [
            open,
            positioning.side,
            positioning.align,
            positioning.anchorHidden,
            instant
        ]
    );

    React.useEffect(() => {
        if (!open) {
            return undefined;
        }

        function handleResize() {
            ReactDOM.flushSync(() => {
                setInstant(true);
            });

            resizeTimeout.start(100, () => {
                setInstant(false);
            });
        }

        const win = ownerWindow(positionerElement);
        win.addEventListener('resize', handleResize);
        return () => {
            win.removeEventListener('resize', handleResize);
        };
    }, [open, resizeTimeout, positionerElement]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, setPositionerElement, positionerRef],
        props: [defaultProps, getDisabledMountTransitionStyles(transitionStatus), elementProps],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <NavigationMenuPositionerContext.Provider value={positioning}>
            {element}
        </NavigationMenuPositionerContext.Provider>
    );
}

export type NavigationMenuPositionerState = {
    /**
     * Whether the navigation menu is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    /**
     * Whether CSS transitions should be disabled.
     */
    instant: boolean;
};

export type NavigationMenuPositionerProps = {} & useAnchorPositioning.SharedParameters & HeadlessUIComponentProps<'div', NavigationMenuPositioner.State>;

export namespace NavigationMenuPositioner {
    export type State = NavigationMenuPositionerState;
    export type Props = NavigationMenuPositionerProps;
}
