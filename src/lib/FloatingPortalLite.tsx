import React from 'react';
import ReactDOM from 'react-dom';

import { useFloatingPortalNode } from '~@packages/floating-ui-react';

import type { FloatingPortal } from '~@packages/floating-ui-react';

/**
 * `FloatingPortal` includes tabbable logic handling for focus management.
 * For components that don't need tabbable logic, use `FloatingPortalLite`.
 * @internal
 */
export function FloatingPortalLite(componentProps: FloatingPortalLiteProps<any>) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        children,
        container,
        ref,
        ...elementProps
    } = componentProps;

    const { portalNode, portalSubtree } = useFloatingPortalNode({
        container,
        ref,
        componentProps,
        elementProps
    });

    if (!portalSubtree && !portalNode) {
        return null;
    }

    return (
        <React.Fragment>
            {portalSubtree}
            {portalNode && ReactDOM.createPortal(children, portalNode)}
        </React.Fragment>
    );
}

export type FloatingPortalLiteProps<State> = {} & FloatingPortal.Props<State>;

export namespace FloatingPortalLite {
    export type Props<State> = FloatingPortalLiteProps<State>;
}
