import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A button that closes the drawer.
 * Renders a `<button>` element.
 */
export function DrawerClose(componentProps: DrawerClose.Props) {
    return <DialogHeadless.Close {...componentProps} />;
}

export namespace DrawerClose {
    export type State = DialogHeadless.Close.State;

    export type Props = DialogHeadless.Close.Props;
}
