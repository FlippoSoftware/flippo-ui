import React from 'react';

import { InternalBackdrop } from '~@lib/InternalBackdrop';
import { FloatingPortal } from '~@packages/floating-ui-react';

import { useDialogRootContext } from '../root/DialogRootContext';

import { DialogPortalContext } from './DialogPortalContext';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DialogPortal(props: DialogPortalProps) {
    const { keepMounted = false, ...portalProps } = props;

    const { store } = useDialogRootContext();
    const mounted = store.useState('mounted');
    const modal = store.useState('modal');

    const shouldRender = mounted || keepMounted;
    if (!shouldRender) {
        return null;
    }

    return (
        <DialogPortalContext.Provider value={keepMounted}>
            <FloatingPortal {...portalProps}>
                {mounted && modal === true && (
                    <InternalBackdrop ref={store.context.internalBackdropRef} inert={!open} />
                )}
                {props.children}
            </FloatingPortal>
        </DialogPortalContext.Provider>
    );
}

export namespace DialogPortal {
    export type State = {};
}

export type DialogPortalProps = {
    /**
     * Whether to keep the portal mounted in the DOM while the popup is hidden.
     * @default false
     */
    keepMounted?: boolean;
    /**
     * A parent element to render the portal element into.
     */
    container?: FloatingPortal.Props<DialogPortal.State>['container'];
} & FloatingPortal.Props<DialogPortal.State>;

export namespace DialogPortal {
    export type Props = DialogPortalProps;
}
