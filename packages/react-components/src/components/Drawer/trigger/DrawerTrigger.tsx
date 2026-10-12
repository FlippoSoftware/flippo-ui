import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A button that opens the drawer.
 * Renders a `<button>` element.
 */
export function DrawerTrigger(componentProps: DrawerTrigger.Props) {
    return <DialogHeadless.Trigger {...componentProps} />;
}

export namespace DrawerTrigger {
    export type State = DialogHeadless.Trigger.State;

    export type Props = DialogHeadless.Trigger.Props;
}
