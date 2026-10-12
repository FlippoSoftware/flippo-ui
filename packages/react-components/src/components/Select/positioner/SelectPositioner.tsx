import React from 'react';

import { SelectPositionerMachine } from '@flippo-software/core-components/select';

import type { SelectPositionerOptions } from '@flippo-software/core-components/select';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useDirection, useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectRoot } from '../root/SelectRootContext';

import { SelectPositionerContext } from './SelectPositionerContext';

import type { SelectPositionerContextValue } from './SelectPositionerContext';

/**
 * Positions the select popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectPositioner(componentProps: SelectPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking,
        alignItemWithTrigger = true,
        collisionAvoidance,
        ref,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const direction = useDirection();

    const positioner = useMachine((options) => new SelectPositionerMachine(root, options), {
        anchor,
        positionMethod,
        side,
        align,
        sideOffset,
        alignOffset,
        collisionBoundary,
        collisionPadding,
        arrowPadding,
        sticky,
        disableAnchorTracking,
        alignItemWithTrigger,
        collisionAvoidance,
        direction
    } as SelectPositionerOptions);
    const state: SelectPositioner.State = useMachineState(positioner);
    const track = useTracker();

    const contextValue: SelectPositionerContextValue = React.useMemo(() => ({ positioner }), [positioner]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, positioner.setElement],
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <SelectPositionerContext value={contextValue}>
            {track(() => positioner.shouldRenderInternalBackdrop()) && (
                <div {...track(() => toReactProps(positioner.getInternalBackdropProps()))} />
            )}
            {element}
        </SelectPositionerContext>
    );
}

export type SelectPositionerState = {
    open: boolean;
    side: Side | 'none';
    align: Align;
    anchorHidden: boolean;
};

export type SelectPositionerProps = {
    /**
     * Whether the positioner overlaps the trigger so the selected item's text is aligned with the trigger's value text.
     * This only applies to mouse input and is automatically disabled if there is not enough space.
     * @default true
     */
    alignItemWithTrigger?: boolean;
} & useAnchorPositioning.SharedParameters &
    HeadlessUIComponentProps<'div', SelectPositioner.State>;

export namespace SelectPositioner {
    export type State = SelectPositionerState;
    export type Props = SelectPositionerProps;
}
