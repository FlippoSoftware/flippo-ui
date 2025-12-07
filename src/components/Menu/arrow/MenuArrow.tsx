import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuPositionerContext } from '../positioner/MenuPositionerContext';
import { useMenuRootContext } from '../root/MenuRootContext';

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
    const {
        arrowRef,
        side,
        align,
        arrowUncentered,
        arrowStyles
    } = useMenuPositionerContext();
    const open = store.useState('open');

    const state: MenuArrow.State = React.useMemo(
        () => ({
            open,
            side,
            align,
            uncentered: arrowUncentered
        }),
        [open, side, align, arrowUncentered]
    );

    return useRenderElement('div', componentProps, {
        ref: [arrowRef, ref],
        customStyleHookMapping: popupStateMapping,
        state,
        props: {
            'style': arrowStyles,
            'aria-hidden': true,
            ...elementProps
        }
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
};

export type MenuArrowProps = {} & HeadlessUIComponentProps<'div', MenuArrow.State>;

export namespace MenuArrow {
    export type State = MenuArrowState;
    export type Props = MenuArrowProps;
}
