import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';

/**
 * A positioning container for the dialog popup that can be made scrollable.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export function DrawerViewport(componentProps: DrawerViewport.Props) {
    return <DialogHeadless.Viewport {...componentProps} />;
}

export namespace DrawerViewport {
    export type State = DialogHeadless.Viewport.State;

    export type Props = DialogHeadless.Viewport.Props;
}
