import React from 'react';

import { FloatingPortal } from '~@packages/floating-ui-react';

import { useMenuRootContext } from '../root/MenuRootContext';

import { MenuPortalContext } from './MenuPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuPortal(componentProps: MenuPortal.Props) {
    const { keepMounted = false, ...portalProps } = componentProps;

    const { store } = useMenuRootContext();
    const mounted = store.useState('mounted');

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <MenuPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps} />
        </MenuPortalContext.Provider>
    );
}

export namespace MenuPortal {
    export type State = {};
}

export type MenuPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
} & FloatingPortal.Props<MenuPortal.State>;

export namespace MenuPortal {
    export type Props = MenuPortalProps;
}
