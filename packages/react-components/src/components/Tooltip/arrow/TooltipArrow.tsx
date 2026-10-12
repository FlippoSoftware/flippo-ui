import React from 'react';

import { toReactProps, useMachineState } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipMultipleContext } from '../multiple/TooltipMultipleContext';
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

    const root = useTooltipRootContext();
    const multiple = useTooltipMultipleContext();
    const { positioner } = useTooltipPositionerContext();

    const arrow = React.useMemo(
        () => ({
            getState: () => ({ ...positioner.getArrowState(), multipleActive: root.isMultipleActive() }),
            setElement: (element: Element | null) => positioner.controller.setArrow(element)
        }),
        [root, positioner]
    );
    const state: TooltipArrow.State = useMachineState(
        arrow,
        multiple ? [root.store, positioner.controller, multiple.store] : [root.store, positioner.controller]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [forwardedRef, arrow.setElement],
        props: [elementProps, (props) => toReactProps(positioner.getArrowProps(props))],
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
