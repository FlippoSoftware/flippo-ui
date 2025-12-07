import React from 'react';

import { FloatingPortal } from '~@packages/floating-ui-react';

import { usePopoverRootContext } from '../root/PopoverRootContext';

import { PopoverPortalContext } from './PopoverPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverPortal(props: PopoverPortal.Props) {
    const { keepMounted = false, ...portalProps } = props;

    const { store } = usePopoverRootContext();
    const mounted = store.useState('mounted');

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <PopoverPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps} renderGuards={false} />
        </PopoverPortalContext.Provider>
    );
}

export namespace PopoverPortal {
    export type State = {};
}

export type PopoverPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
} & FloatingPortal.Props<PopoverPortal.State>;

export namespace PopoverPortal {
    export type Props = PopoverPortalProps;
}
