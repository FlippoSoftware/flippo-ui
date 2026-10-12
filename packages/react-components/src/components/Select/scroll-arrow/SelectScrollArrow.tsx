import React from 'react';

import { SelectScrollArrowMachine } from '@flippo-software/core-components/select';
import { useIsoLayoutEffect } from '@flippo-software/hooks';

import type { TransitionStatus } from '@flippo-software/hooks';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';

import type { Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRootContext } from '../root/SelectRootContext';

/**
 * @internal
 */
export function SelectScrollArrow(componentProps: SelectScrollArrow.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        direction,
        keepMounted = false,
        ...elementProps
    } = componentProps;

    const root = useSelectRootContext();
    const { positioner } = useSelectPositionerContext();

    const [arrow] = React.useState(() => new SelectScrollArrowMachine(root, positioner, direction));
    useIsoLayoutEffect(() => arrow.connect(), [arrow]);

    const state: SelectScrollArrow.State = useMachineState(arrow);
    const track = useTracker();

    return useRenderElement('div', componentProps, {
        ref: [ref, arrow.setElement],
        state,
        props: [elementProps, (props) => track(() => toReactProps(arrow.getProps(props)))],
        enabled: track(() => arrow.shouldRender(keepMounted))
    });
}

export type SelectScrollArrowState = {
    direction: 'up' | 'down';
    visible: boolean;
    side: Side | 'none';
    transitionStatus: TransitionStatus;
};

export type SelectScrollArrowProps = {
    direction: 'up' | 'down';
    /**
     * Whether to keep the HTML element in the DOM while the select popup is not scrollable.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'div', SelectScrollArrow.State>;

export namespace SelectScrollArrow {
    export type State = SelectScrollArrowState;
    export type Props = SelectScrollArrowProps;
}
