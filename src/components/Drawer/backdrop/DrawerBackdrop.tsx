import React from 'react';

import { Dialog as DialogHeadless } from '../../Dialog';
import { useDrawerRootContext } from '../root/DrawerRootContext';

/**
 * An overlay element that covers the page content when the drawer is open.
 * Renders a `<div>` element.
 */
export function DrawerBackdrop(componentProps: DrawerBackdrop.Props) {
    const { store: drawerStore } = useDrawerRootContext();

    const dataAttributes = drawerStore.useState('popupDataAttributes');

    return <DialogHeadless.Backdrop {...componentProps} {...dataAttributes} />;
}

export namespace DrawerBackdrop {
    export type State = DialogHeadless.Backdrop.State;

    export type Props = DialogHeadless.Backdrop.Props;
}
