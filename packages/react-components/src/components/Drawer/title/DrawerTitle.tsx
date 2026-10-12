import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A title element for the drawer.
 * Renders an `<h2>` element.
 */
export function DrawerTitle(componentProps: DrawerTitle.Props) {
    return <DialogHeadless.Title {...componentProps} />;
}

export namespace DrawerTitle {
    export type State = DialogHeadless.Title.State;

    export type Props = DialogHeadless.Title.Props;
}
