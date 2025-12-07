import React from 'react';
import ReactDOM from 'react-dom';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';
import { FloatingNode } from '~@packages/floating-ui-react';
import { contains, getTarget } from '~@packages/floating-ui-react/utils';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, HTMLProps } from '~@lib/types';

import { CompositeRoot } from '../../Composite/root/CompositeRoot';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import {
    useNavigationMenuRootContext,
    useNavigationMenuTreeContext
} from '../root/NavigationMenuRootContext';

const stateAttributesMapping: StateAttributesMapping<NavigationMenuContent.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping,
    activationDirection(value) {
        if (!value) {
            return null;
        }
        return {
            'data-activation-direction': value
        };
    }
};

/**
 * A container for the content of the navigation menu item that is moved into the popup
 * when the item is active.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuContent(componentProps: NavigationMenuContentProps) {
    const {
        className,
        render,
        ref: refProp,
        ...elementProps
    } = componentProps;

    const {
        mounted: popupMounted,
        viewportElement,
        value,
        activationDirection,
        currentContentRef,
        viewportTargetElement
    } = useNavigationMenuRootContext();
    const { value: itemValue } = useNavigationMenuItemContext();
    const nodeId = useNavigationMenuTreeContext();

    const open = popupMounted && value === itemValue;

    const ref = React.useRef<HTMLDivElement | null>(null);

    const [focusInside, setFocusInside] = React.useState(false);

    const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

    useOpenChangeComplete({
        ref,
        open,
        onComplete() {
            if (!open) {
                setMounted(false);
            }
        }
    });

    const state: NavigationMenuContent.State = React.useMemo(
        () => ({
            open,
            transitionStatus,
            activationDirection
        }),
        [open, transitionStatus, activationDirection]
    );

    const handleCurrentContentRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                currentContentRef.current = node;
            }
        },
        [currentContentRef]
    );

    const commonProps: HTMLProps<HTMLDivElement> = {
        onFocus(event) {
            const target = getTarget(event.nativeEvent) as Element | null;
            if (target?.hasAttribute('data-base-ui-focus-guard')) {
                return;
            }
            setFocusInside(true);
        },
        onBlur(event) {
            if (!contains(event.currentTarget, event.relatedTarget)) {
                setFocusInside(false);
            }
        }
    };

    const defaultProps: HTMLProps
    = !open && mounted
        ? {
            style: { position: 'absolute', top: 0, left: 0 },
            inert: !focusInside,
            ...commonProps
        }
        : commonProps;

    const portalContainer = viewportTargetElement || viewportElement;
    const shouldRender = portalContainer !== null && mounted;

    if (!portalContainer || !shouldRender) {
        return null;
    }

    return ReactDOM.createPortal(
        <FloatingNode id={nodeId}>
            <CompositeRoot
              render={render}
              className={className}
              state={state}
              refs={[ref, refProp, handleCurrentContentRef]}
              props={[defaultProps, elementProps]}
              stateAttributesMapping={stateAttributesMapping}
            />
        </FloatingNode>,
        portalContainer
    );
}

export type NavigationMenuContentState = {
    /**
     * If `true`, the component is open.
     */
    open: boolean;
    /**
     * The transition status of the component.
     */
    transitionStatus: TransitionStatus;
    /**
     * The direction of the activation.
     */
    activationDirection: 'left' | 'right' | 'up' | 'down' | null;
};

export type NavigationMenuContentProps = {} & HeadlessUIComponentProps<'div', NavigationMenuContent.State>;

export namespace NavigationMenuContent {
    export type State = NavigationMenuContentState;
    export type Props = NavigationMenuContentProps;
}
