import React from 'react';

import { mergeProps } from '~@lib/merge';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { Dialog as DialogHeadless } from '../../Dialog';
import { useDrawerRootContext } from '../root/DrawerRootContext';

import type { DrawerDirection } from '../store';

import { DrawerPopupCssVars } from './DrawerPopupCssVars';
import { DrawerPopupDataAttributes } from './DrawerPopupDataAttributes';

const customStyleHookMapping: StateAttributesMapping<DrawerPopup.State> = {
    dragging(value) {
        return value ? { [DrawerPopupDataAttributes.dragging]: '' } : null;
    },
    direction(value) {
        return { [DrawerPopupDataAttributes.direction]: value };
    }
};

/**
 * A container for the drawer popup with drag and drop support.
 * Renders a `<div>` element.
 */
export function DrawerPopup(componentProps: DrawerPopup.Props) {
    const { store } = useDrawerRootContext();

    const direction = store.useState('direction');
    const shouldDrag = store.useState('shouldDrag');
    const isDragging = store.useState('isDragging');
    const dragOffset = store.useState('dragOffset');
    const popupStyle = store.useState('popupStyle');
    const popupDataAttributes = store.useState('popupDataAttributes');

    const drawerProps = React.useMemo(() => {
        return mergeProps(componentProps, {
            style: shouldDrag
                ? { ...popupStyle, [DrawerPopupCssVars.dragOffset]: `${dragOffset}px` }
                : {},
            ...customStyleHookMapping.dragging?.(isDragging),
            ...customStyleHookMapping.direction?.(direction),
            ...popupDataAttributes
        });
    }, [
        componentProps,
        shouldDrag,
        popupStyle,
        dragOffset,
        isDragging,
        direction,
        popupDataAttributes
    ]);

    return <DialogHeadless.Popup {...drawerProps} />;
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
