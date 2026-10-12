import React from 'react';

import { useStoreSelector } from '~@lib/core';
import { FloatingPortal } from '~@lib/floating';

import { useTooltipRootContext } from '../root/TooltipRootContext';

import { TooltipPortalContext } from './TooltipPortalContext';

export function TooltipPortal(props: TooltipPortalProps) {
    const { keepMounted = false, ...portalProps } = props;

    const root = useTooltipRootContext();
    const mounted = useStoreSelector(root.store, 'mounted');

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <TooltipPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps} renderGuards={false} />
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
} & Omit<FloatingPortal.Props<TooltipPortal.State>, 'renderGuards'>;

export namespace TooltipPortal {
    export type Props = TooltipPortalProps;
}
