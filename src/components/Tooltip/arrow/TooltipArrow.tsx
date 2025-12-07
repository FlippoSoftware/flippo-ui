import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipPositionerContext } from '../positioner/TooltipPositionerContext';

/**
 * Displays an element positioned against the tooltip anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Tooltip](https://base-ui.com/react/components/tooltip)
 */
export function TooltipArrow({ ref: forwardedRef, ...componentProps }: TooltipArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ...elementProps
    } = componentProps;

    const {
        open,
        arrowRef,
        side,
        align,
        arrowUncentered,
        arrowStyles
    }
    = useTooltipPositionerContext();

    const state: TooltipArrow.State = React.useMemo(
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
        ref: [forwardedRef, arrowRef],
        props: [{ 'style': arrowStyles, 'aria-hidden': true }, elementProps],
        customStyleHookMapping: popupStateMapping
    });

    return element;
}

export namespace TooltipArrow {
    export type State = {
        open: boolean;
        side: Side;
        align: Align;
        uncentered: boolean;
    };

    export type Props = HeadlessUIComponentProps<'div', State> & {
        ref?: React.Ref<HTMLDivElement>;
    };
}
