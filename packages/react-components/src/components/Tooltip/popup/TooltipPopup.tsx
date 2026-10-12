import React from 'react';

import { TooltipPopupMachine } from '@flippo-software/core-components/tooltip';
import { useIsoLayoutEffect } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useFloatingTree } from '~@lib/floating';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useTooltipMultipleContext } from '../multiple/TooltipMultipleContext';
import { useTooltipPositionerContext } from '../positioner/TooltipPositionerContext';
import { useTooltipRootContext } from '../root/TooltipRootContext';
import { multipleActive } from '../utils/stateAttributes';

const stateAttributesMapping: StateAttributesMapping<TooltipPopup.State> = {
    ...baseMapping,
    ...transitionStatusMapping,
    multipleActive
};

export function TooltipPopup(componentProps: TooltipPopupProps) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const root = useTooltipRootContext();
    const multiple = useTooltipMultipleContext();
    const { positioner } = useTooltipPositionerContext();
    const tree = useFloatingTree();

    const [popup] = React.useState(() => new TooltipPopupMachine(root, { positioner, multiple, tree }));
    useIsoLayoutEffect(() => popup.connect(), [popup]);
    const track = useTracker();
    const state: TooltipPopup.State = useMachineState(
        popup,
        multiple ? [root.store, positioner.controller, multiple.store] : [root.store, positioner.controller]
    );

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, popup.setElement],
        props: [elementProps, (props) => track(() => toReactProps(popup.getPopupProps(props)))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type TooltipPopupState = {
    /**
     * Whether the tooltip is currently active in the multiple context.
     */
    multipleActive: boolean;
    /**
     * Whether the tooltip is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    instant: 'delay' | 'focus' | 'dismiss' | undefined;
    transitionStatus: TransitionStatus;
};

export type TooltipPopupProps = {} & HeadlessUIComponentProps<'div', TooltipPopup.State>;

export namespace TooltipPopup {
    export type State = TooltipPopupState;
    export type Props = TooltipPopupProps;
}
