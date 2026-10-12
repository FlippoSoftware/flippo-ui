import React from 'react';

import { AnchorPositioner } from '@flippo-software/core-components/positioning';

import { toReactProps, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

/**
 * Displays an element positioned against the anchor.
 * Renders a `<div>` element.
 */
export function ComboboxArrow(componentProps: ComboboxArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const { positioner } = useComboboxPositionerContext();
    const anchor = positioner.positioner;

    const arrow = React.useMemo(
        () => ({
            getState: (): ComboboxArrow.State => {
                const { side, align } = positioner.getState();
                return { open: root.store.state.open, side, align, uncentered: AnchorPositioner.arrowUncentered(anchor.store.state) };
            },
            setElement: (element: Element | null) => anchor.setArrow(element)
        }),
        [root, positioner, anchor]
    );
    const state = useMachineState(arrow);

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrow.setElement],
        props: [elementProps, (props) => toReactProps({ style: positioner.getArrowStyles(), 'aria-hidden': true, ...props })],
        customStyleHookMapping: popupStateMapping
    });
}

export type ComboboxArrowState = {
    /**
     * Whether the popup is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    uncentered: boolean;
};

export type ComboboxArrowProps = {} & HeadlessUIComponentProps<'div', ComboboxArrow.State>;

export namespace ComboboxArrow {
    export type State = ComboboxArrowState;
    export type Props = ComboboxArrowProps;
}
