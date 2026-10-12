import React from 'react';

import { PopoverArrow as PopoverArrowCore } from '@flippo-software/core-components/popover';

import { toReactProps, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverPositionerContext } from '../positioner/PopoverPositionerContext';
import { usePopoverRootContext } from '../root/PopoverRootContext';

/**
 * Displays an element positioned against the popover anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverArrow(componentProps: PopoverArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();
    const { positioner } = usePopoverPositionerContext();

    const arrow = React.useMemo(
        () => ({
            getState: () => PopoverArrowCore.getState(store, positioner),
            setElement: (element: Element | null) => PopoverArrowCore.setElement(positioner, element)
        }),
        [store, positioner]
    );
    const state: PopoverArrow.State = useMachineState(arrow, [positioner.controller]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrow.setElement],
        props: [elementProps, (props) => toReactProps(PopoverArrowCore.getProps(positioner, props))],
        customStyleHookMapping: popupStateMapping
    });

    return element;
}

export type PopoverArrowState = {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    uncentered: boolean;
};

export type PopoverArrowProps = {} & HeadlessUIComponentProps<'div', PopoverArrow.State>;

export namespace PopoverArrow {
    export type State = PopoverArrowState;
    export type Props = PopoverArrowProps;
}
