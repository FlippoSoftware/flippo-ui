import React from 'react';

import { AnchorPositioner } from '@flippo-software/core-components/positioning';

import { toReactProps, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Align, Side } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useSelectRoot } from '../root/SelectRootContext';

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

    const root = useSelectRoot();
    const { positioner } = useSelectPositionerContext();
    const anchor = positioner.positioner;

    const arrow = React.useMemo(
        () => ({
            getState: (): SelectArrow.State => {
                const { side, align } = positioner.getState();
                return {
                    open: root.store.state.open,
                    side,
                    align,
                    uncentered: AnchorPositioner.arrowUncentered(anchor.store.state)
                };
            },
            setElement: (element: Element | null) => anchor.setArrow(element)
        }),
        [root, positioner, anchor]
    );
    const state = useMachineState(arrow);
    const track = useTracker();

    // The arrow is hidden while the popup is aligned with the trigger.
    const alignItemWithTriggerActive = track(() => positioner.alignItemWithTriggerActive);

    return useRenderElement('div', componentProps, {
        state,
        ref: [ref, arrow.setElement],
        props: [
            elementProps,
            (props) =>
                toReactProps({
                    style: track(() => AnchorPositioner.arrowStyles(anchor.store.state)),
                    'aria-hidden': true,
                    ...props
                })
        ],
        customStyleHookMapping,
        enabled: !alignItemWithTriggerActive
    });
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
