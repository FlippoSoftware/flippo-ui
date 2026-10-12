import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A portal element that renders the drawer content in a different part of the DOM.
 */
export function DrawerPortal(props: DrawerPortal.Props) {
    return <DialogHeadless.Portal {...props} />;
}

export namespace DrawerPortal {
    export type State = DialogHeadless.Portal.State;

    export type Props = DialogHeadless.Portal.Props;
}
