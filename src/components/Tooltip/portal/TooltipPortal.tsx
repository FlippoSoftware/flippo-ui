import React from 'react';

import { FloatingPortalLite } from '~@lib/FloatingPortalLite';

import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPortalContext } from './TooltipPortalContext';

export function TooltipPortal(props: TooltipPortalProps) {
    const { keepMounted = false, ...portalProps } = props;

    const store = useTooltipRootContext();
    const mounted = store.useState('mounted');

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <TooltipPortalContext.Provider value={keepMounted}>
            <FloatingPortalLite {...portalProps} />
        </TooltipPortalContext.Provider>
    );
}

export namespace TooltipPortal {
    export type State = {};
}

export type TooltipPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
} & FloatingPortalLite.Props<TooltipPortal.State>;

export namespace TooltipPortal {
    export type Props = TooltipPortalProps;
}
