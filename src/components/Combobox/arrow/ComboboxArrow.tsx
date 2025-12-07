import React from 'react';

import { useStore } from '@flippo-ui/hooks/use-store';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { selectors } from '../store';

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

    const store = useComboboxRootContext();
    const {
        arrowRef,
        side,
        align,
        arrowUncentered,
        arrowStyles
    } = useComboboxPositionerContext();

    const open = useStore(store, selectors.open);

    const state: ComboboxArrow.State = React.useMemo(
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
