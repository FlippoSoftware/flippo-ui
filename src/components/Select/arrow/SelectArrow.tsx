import React from 'react';

import { useStore } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRootContext } from '../root/SelectRootContext';
import { selectors } from '../store';

const customStyleHookMapping: StateAttributesMapping<SelectArrow.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * Displays an element positioned against the select menu anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectArrow(componentProps: SelectArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store } = useSelectRootContext();
    const {
        side,
        align,
        arrowRef,
        arrowStyles,
        arrowUncentered,
        alignItemWithTriggerActive
    }
        = useSelectPositionerContext();

    const open = useStore(store, selectors.open, true);

    const state: SelectArrow.State = React.useMemo(
        () => ({
            open,
            side,
            align,
            uncentered: arrowUncentered
        }),
        [open, side, align, arrowUncentered]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [arrowRef, ref],
        props: [{ 'style': arrowStyles, 'aria-hidden': true }, elementProps],
        customStyleHookMapping
    });

    if (alignItemWithTriggerActive) {
        return null;
    }

    return element;
}

export type SelectArrowState = {
    /**
     * Whether the select popup is currently open.
     */
    open: boolean;
    side: Side | 'none';
    align: Align;
    uncentered: boolean;
};

export type SelectArrowProps = {} & HeadlessUIComponentProps<'div', SelectArrow.State>;

export namespace SelectArrow {
    export type State = SelectArrowState;
    export type Props = SelectArrowProps;
}
