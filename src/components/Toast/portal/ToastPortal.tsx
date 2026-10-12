import React from 'react';

import { FloatingPortal } from '~@lib/floating';

/**
 * A portal element that moves the viewport to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 */
export function ToastPortal(props: ToastPortal.Props) {
    return <FloatingPortal {...props} renderGuards={false} />;
}

export type ToastPortalProps = {} & Omit<FloatingPortal.Props<ToastPortal.State>, 'renderGuards'>;

// eslint-disable-next-line ts/no-redeclare
export namespace ToastPortal {
    export type State = {};

    export type Props = ToastPortalProps;
}
