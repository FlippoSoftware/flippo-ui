import React from 'react';

import type { TransitionStatus } from '@flippo-software/react-hooks/use-transition-status';

import { toReactProps, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

const stateAttributesMapping: StateAttributesMapping<MenuArrow.State> = {
    ...popupStateMapping,
    ...transitionStatusMapping
};

/**
 * Displays an element positioned against the menu anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuArrow(componentProps: MenuArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store } = useMenuRootContext();
    const { positioner } = useMenuPositionerContext();

    const arrow = React.useMemo(
        () => ({
            getState: (): MenuArrow.State => {
                const { side, align } = positioner.getState();
                return {
                    open: store.select('open'),
                    side,
                    align,
                    uncentered: positioner.controller.isArrowUncentered(),
                    transitionStatus: store.select('transitionStatus')
                };
            },
            setElement: (element: Element | null) => positioner.controller.setArrow(element)
        }),
        [store, positioner]
    );
    const state = useMachineState(arrow, [positioner.controller]);

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrow.setElement],
        props: [elementProps, (props) => toReactProps({ style: positioner.controller.getArrowStyles(), 'aria-hidden': true, ...props })],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type MenuArrowState = {
    /**
     * Whether the menu is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    uncentered: boolean;
    transitionStatus: TransitionStatus;
};

export type MenuArrowProps = {} & HeadlessUIComponentProps<'div', MenuArrow.State>;

export namespace MenuArrow {
    export type State = MenuArrowState;
    export type Props = MenuArrowProps;
}
