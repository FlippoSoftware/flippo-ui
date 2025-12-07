import React from 'react';

import { useId, useIsoLayoutEffect } from '@flippo-ui/hooks';

import { FocusGuard } from '~@lib/FocusGuard';
import { useRenderElement } from '~@lib/hooks';
import {
    contains,
    getNextTabbable,
    getPreviousTabbable,
    isOutsideEvent
} from '~@packages/floating-ui-react/utils';
import { getEmptyRootContext } from '~@packages/floating-ui-react/utils/getEmptyRootContext';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useNavigationMenuPositionerContext } from '../positioner/NavigationMenuPositionerContext';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

const EMPTY_ROOT_CONTEXT = getEmptyRootContext();

function Guards({ children }: { children: React.ReactNode }) {
    const {
        beforeInsideRef,
        beforeOutsideRef,
        afterInsideRef,
        afterOutsideRef,
        positionerElement,
        viewportElement,
        floatingRootContext
    } = useNavigationMenuRootContext();
    const hasPositioner = Boolean(useNavigationMenuPositionerContext(true));

    const referenceElement = positionerElement || viewportElement;

    if (!floatingRootContext && !hasPositioner) {
        return children;
    }

    return (
        <React.Fragment>
            <FocusGuard
              ref={beforeInsideRef}
              onFocus={(event) => {
                    if (referenceElement && isOutsideEvent(event, referenceElement)) {
                        getNextTabbable(referenceElement)?.focus();
                    }
                    else {
                        beforeOutsideRef.current?.focus();
                    }
                }}
            />
            {children}
            <FocusGuard
              ref={afterInsideRef}
              onFocus={(event) => {
                    if (referenceElement && isOutsideEvent(event, referenceElement)) {
                        getPreviousTabbable(referenceElement)?.focus();
                    }
                    else {
                        afterOutsideRef.current?.focus();
                    }
                }}
            />
        </React.Fragment>
    );
}

/**
 * The clipping viewport of the navigation menu's current content.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */

export function NavigationMenuViewport(componentProps: NavigationMenuViewportProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        children,
        id: idProp,
        ...elementProps
    } = componentProps;

    const id = useId(idProp);

    const {
        setViewportElement,
        setViewportTargetElement,
        floatingRootContext,
        prevTriggerElementRef,
        viewportInert,
        setViewportInert
    } = useNavigationMenuRootContext();

    const hasPositioner = Boolean(useNavigationMenuPositionerContext(true));
    const domReference = (floatingRootContext || EMPTY_ROOT_CONTEXT).useState('domReferenceElement');

    useIsoLayoutEffect(() => {
        if (domReference) {
            prevTriggerElementRef.current = domReference;
        }
    }, [domReference, prevTriggerElementRef]);

    const element = useRenderElement('div', componentProps, {
        ref: [ref, setViewportElement],
        props: [{
            id,
            onBlur(event) {
                const relatedTarget = event.relatedTarget as Element | null;
                const currentTarget = event.currentTarget as Element;

                // If focus is leaving the viewport and not going to the trigger, make it inert
                // to prevent a focus loop.
                if (
                    relatedTarget
                    && !contains(currentTarget, relatedTarget)
                    && relatedTarget !== domReference
                ) {
                    setViewportInert(true);
                }
            },
            ...(!hasPositioner && viewportInert && { inert: true }),
            children: hasPositioner
                ? (
                    children
                )
                : (
                    <Guards>
                        <div ref={setViewportTargetElement}>{children}</div>
                    </Guards>
                )
        }, elementProps]
    });

    return hasPositioner ? <Guards>{element}</Guards> : element;
}

export type NavigationMenuViewportState = {};

export type NavigationMenuViewportProps = {} & HeadlessUIComponentProps<'div', NavigationMenuViewport.State>;

export namespace NavigationMenuViewport {
    export type State = NavigationMenuViewportState;
    export type Props = NavigationMenuViewportProps;
}
