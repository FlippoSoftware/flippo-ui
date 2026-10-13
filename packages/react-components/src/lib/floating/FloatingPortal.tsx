import React from 'react';
import * as ReactDOM from 'react-dom';

import { FloatingPortalController, PORTAL_ATTRIBUTE, resolvePortalContainer } from '@flippo-software/core-components/floating';
import { useId, useIsoLayoutEffect } from '@flippo-software/react-hooks';

import type { PortalContainer } from '@flippo-software/core-components/floating';

import { ownerVisuallyHidden } from '~@lib/constants';
import { useStoreState } from '~@lib/core';
import { FocusGuard } from '~@lib/FocusGuard';
import { useRenderElement } from '~@lib/hooks/useRenderElement';

import type { HeadlessUIComponentProps } from '~@lib/types';

const FloatingPortalContext = React.createContext<FloatingPortalController | null>(null);

/**
 * The controller of the closest `FloatingPortal` (passed to core focus managers as `portal`).
 */
export function useFloatingPortalController() {
    return React.use(FloatingPortalContext);
}

const NO_PARENT_PORTAL = new FloatingPortalController();

/**
 * Portals the floating element into a container (by default `<body>`, or the parent portal) while
 * keeping it next to its reference in the tab order (core `FloatingPortalController`).
 */
export function FloatingPortal<State>(componentProps: FloatingPortal.Props<State>) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        container,
        renderGuards,
        ref,
        ...elementProps
    } = componentProps;

    const id = useId();
    const parent = useFloatingPortalController();
    const parentPortalNode = useStoreState((parent ?? NO_PARENT_PORTAL).state).portalNode;

    const [portal] = React.useState(() => new FloatingPortalController());
    useIsoLayoutEffect(() => portal.connect(), [portal]);
    const { portalNode } = useStoreState(portal.state);

    const [containerElement, setContainerElement] = React.useState<HTMLElement | ShadowRoot | null>(null);
    useIsoLayoutEffect(() => {
        if (id != null) {
            setContainerElement(resolvePortalContainer(container, parentPortalNode));
        }
    }, [container, parentPortalNode, id]);

    const shouldRenderGuards = portal.shouldRenderGuards(renderGuards) && portalNode !== null;

    const portalElement = useRenderElement('div', componentProps as useRenderElement.ComponentProps<object>, {
        ref: [ref, portal.setPortalNode],
        props: [{ id, [PORTAL_ATTRIBUTE]: '' }, elementProps]
    });

    return (
        <React.Fragment>
            {containerElement && portalElement && ReactDOM.createPortal(portalElement, containerElement)}
            <FloatingPortalContext value={portal}>
                {shouldRenderGuards && (
                    <FocusGuard
                        data-type='outside'
                        ref={(element: HTMLSpanElement | null) => {
                            portal.beforeOutsideRef.current = element;
                        }}
                        onFocus={(event) => portal.onBeforeOutsideGuardFocus(event.nativeEvent)}
                    />
                )}
                {shouldRenderGuards && portalNode && <span aria-owns={portalNode.id} style={ownerVisuallyHidden} />}
                {portalNode && ReactDOM.createPortal(children, portalNode)}
                {shouldRenderGuards && (
                    <FocusGuard
                        data-type='outside'
                        ref={(element: HTMLSpanElement | null) => {
                            portal.afterOutsideRef.current = element;
                        }}
                        onFocus={(event) => portal.onAfterOutsideGuardFocus(event.nativeEvent)}
                    />
                )}
            </FloatingPortalContext>
        </React.Fragment>
    );
}

export namespace FloatingPortal {
    export type Props<State> = {
        /**
         * Whether to render the focus guards that keep the portal in the tab order (by default, when a
         * non-modal popup is open inside).
         */
        renderGuards?: boolean;
        /**
         * A parent element to render the portal element into.
         */
        container?: PortalContainer | React.RefObject<HTMLElement | ShadowRoot | null>;
    } & HeadlessUIComponentProps<'div', State>;
}
