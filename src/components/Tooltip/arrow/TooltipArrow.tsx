import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipPositionerContext } from '../positioner/TooltipPositionerContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';
import { multipleActive } from '../utils/stateAttributes';

const stateAttributesMapping: StateAttributesMapping<TooltipArrow.State> = {
    ...popupStateMapping,
    multipleActive
};

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
    const store = useTooltipRootContext();

    const multipleActive = store.useMultipleActive();

    const state: TooltipArrow.State = React.useMemo(
        () => ({
            open,
            side,
            align,
            uncentered: arrowUncentered,
            multipleActive
        }),
        [
            open,
            side,
            align,
            arrowUncentered,
            multipleActive
        ]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [forwardedRef, arrowRef],
        props: [{ 'style': arrowStyles, 'aria-hidden': true }, elementProps],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export namespace TooltipArrow {
    export type State = {
        open: boolean;
        side: Side;
        align: Align;
        uncentered: boolean;
        multipleActive: boolean;
    };

    export type Props = HeadlessUIComponentProps<'div', State> & {
        ref?: React.Ref<HTMLDivElement>;
    };
}
