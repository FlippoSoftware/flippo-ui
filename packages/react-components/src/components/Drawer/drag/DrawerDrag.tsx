import React from 'react';

import { DrawerDragDataAttributes, DrawerDragMachine } from '@flippo-software/core-components/drawer';

import type { DrawerDragOptions } from '@flippo-software/core-components/drawer';

import { toReactProps, useMachine, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useDialogRootContext } from '../../Dialog/root/DialogRootContext';
import { useDrawerRootContext } from '../root/DrawerRootContext';

const customStyleHookMapping: StateAttributesMapping<DrawerDrag.State> = {
    ...popupStateMapping,
    dragging(value) {
        return value ? { [DrawerDragDataAttributes.dragging]: '' } : null;
    }
};

/**
 * A visual drag element that can be dragged to open/close the drawer.
 * Renders a `<div>` element.
 */
export function DrawerDrag(componentProps: DrawerDrag.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        containerRef,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        closeThreshold,
        velocityThreshold,
        scrollLockTimeout,
        onDragEnd,
        onDragMove,
        onDragStart,
        onActiveSnapPointIndexChange,
        ...elementProps
    } = componentProps;

    const { store: drawerStore } = useDrawerRootContext();
    const { store: dialogStore } = useDialogRootContext();

    const drag = useMachine((options) => new DrawerDragMachine(drawerStore, dialogStore, options), {
        closeThreshold,
        velocityThreshold,
        scrollLockTimeout,
        onDragEnd,
        onDragMove,
        onDragStart,
        onActiveSnapPointIndexChange
    });
    const state: DrawerDrag.State = useMachineState(drag);

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, drag.setElement],
        props: [elementProps, (props) => toReactProps(drag.getDragProps(props))],
        customStyleHookMapping
    });
}

export namespace DrawerDrag {
    export type State = {
        /**
         * Whether the drawer is currently being dragged.
         */
        dragging: boolean;
        /**
         * Whether the drawer is currently open.
         */
        open: boolean;
    };

    export type Props = {
        /**
         * The threshold for closing the drawer.
         *
         * @default 0.4
         */
        closeThreshold?: number;
        /**
         * The threshold for the velocity of the drag.
         *
         * @default 0.5
         */
        velocityThreshold?: number;
        /**
         * The timeout for the scroll lock.
         *
         * @default 100
         */
        scrollLockTimeout?: number;
        /**
         * The ref to the container element.
         *
         * @default undefined
         */
        containerRef?: React.RefObject<HTMLElement | null>;

        /**
         * The callback function to be called when the drag ends.
         *
         * @default undefined
         */
        onDragEnd?: DrawerDragOptions['onDragEnd'];
        /**
         * The callback function to be called when the drag moves.
         *
         * @default undefined
         */
        onDragMove?: DrawerDragOptions['onDragMove'];
        /**
         * The callback function to be called when the drag starts.
         *
         * @default undefined
         */
        onDragStart?: DrawerDragOptions['onDragStart'];
        /**
         * The callback function to be called when the active snap point index changes.
         *
         * @default undefined
         */
        onActiveSnapPointIndexChange?: DrawerDragOptions['onActiveSnapPointIndexChange'];
    } & HeadlessUIComponentProps<'div', State>;
}
