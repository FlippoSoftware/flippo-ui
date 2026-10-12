import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A description element for the drawer.
 * Renders a `<p>` element.
 */
export function DrawerDescription(componentProps: DrawerDescription.Props) {
    return <DialogHeadless.Description {...componentProps} />;
}

export namespace DrawerDescription {
    export type State = DialogHeadless.Description.State;
    export type Props = DialogHeadless.Description.Props;
}
