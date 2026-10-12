import React from 'react';

import { getDrawerPopupProps } from '@flippo-software/core-components/drawer';

import type { DrawerDirection } from '@flippo-software/core-components/drawer';

import { toReactProps, useTracker } from '~@lib/core';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { Dialog as DialogHeadless } from '../../Dialog';
import { useDrawerRootContext } from '../root/DrawerRootContext';

/**
 * A container for the drawer popup with drag and drop support.
 * Renders a `<div>` element.
 */
export function DrawerPopup(componentProps: DrawerPopup.Props) {
    const { store } = useDrawerRootContext();
    const track = useTracker();

    return (
        <DialogHeadless.Popup {...(track(() => toReactProps(getDrawerPopupProps(store, componentProps))) as DialogHeadless.Popup.Props)} />
    );
}

export namespace DrawerPopup {
    export type State = {
        /**
         * Whether the drawer is currently being dragged.
         */
        dragging: boolean;
        /**
         * Direction from which the drawer opens.
         */
        direction: DrawerDirection;
    } & DialogHeadless.Popup.State;

    export type Props = HeadlessUIComponentProps<'div', State> & DialogHeadless.Popup.Props;
}
