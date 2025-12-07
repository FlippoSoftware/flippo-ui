import React from 'react';

import { FloatingPortal } from '~@packages/floating-ui-react';

import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

import { NavigationMenuPortalContext } from './NavigationMenuPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
export function NavigationMenuPortal(componentProps: NavigationMenuPortalProps) {
    const { keepMounted = false, ...portalProps } = componentProps;

    const { mounted } = useNavigationMenuRootContext();

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <NavigationMenuPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps} />
        </NavigationMenuPortalContext.Provider>
    );
}

export namespace NavigationMenuPortal {
    export type State = {};
}

export type NavigationMenuPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
    /**
     * A parent element to render the portal element into.
     */
    container?: FloatingPortal.Props<NavigationMenuPortal.State>['container'];
} & FloatingPortal.Props<NavigationMenuPortal.State>;

export namespace NavigationMenuPortal {
    export type Props = NavigationMenuPortalProps;
}
