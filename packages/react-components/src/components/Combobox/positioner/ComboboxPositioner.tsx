import React from 'react';

import { ComboboxPositionerMachine } from '@flippo-software/core-components/combobox';

import type { AnchorPositioningSharedOptions } from '@flippo-software/core-components/positioning';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useDirection } from '~@lib/hooks/useDirection';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping } from '~@lib/popupStateMapping';

import type { Align, Side, useAnchorPositioning } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxPortalContext } from '../portal/ComboboxPortalContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import { ComboboxPositionerContext } from './ComboboxPositionerContext';

import type { ComboboxPositionerContextValue } from './ComboboxPositionerContext';

/**
 * Positions the popup against the trigger.
 * Renders a `<div>` element.
 */
export function ComboboxPositioner(componentProps: ComboboxPositioner.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        anchor,
        positionMethod = 'absolute',
        side = 'bottom',
        align = 'center',
        sideOffset = 0,
        alignOffset = 0,
        collisionBoundary = 'clipping-ancestors',
        collisionPadding = 5,
        arrowPadding = 5,
        sticky = false,
        disableAnchorTracking = false,
        collisionAvoidance,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const keepMounted = useComboboxPortalContext();
    const direction = useDirection();

    const positioner = useMachine((options) => new ComboboxPositionerMachine(root, options), {
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
        collisionAvoidance,
        keepMounted,
        direction
    } as AnchorPositioningSharedOptions & { keepMounted?: boolean });
    const state: ComboboxPositioner.State = useMachineState(positioner);
    const track = useTracker();

    const contextValue: ComboboxPositionerContextValue = React.useMemo(() => ({ positioner }), [positioner]);

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [ref, positioner.setElement],
        props: [elementProps, (props) => track(() => toReactProps(positioner.getPositionerProps(props)))],
        customStyleHookMapping: popupStateMapping
    });

    return (
        <ComboboxPositionerContext value={contextValue}>
            {track(() => positioner.shouldRenderInternalBackdrop()) && (
                <div {...track(() => toReactProps(positioner.getInternalBackdropProps()))} />
            )}
            {element}
        </ComboboxPositionerContext>
    );
}

export type ComboboxPositionerState = {
    /**
     * Whether the popup is currently open.
     */
    open: boolean;
    side: Side;
    align: Align;
    anchorHidden: boolean;
    empty: boolean;
};

export type ComboboxPositionerProps = {} & useAnchorPositioning.SharedParameters &
    HeadlessUIComponentProps<'div', ComboboxPositioner.State>;

export namespace ComboboxPositioner {
    export type State = ComboboxPositionerState;
    export type Props = ComboboxPositionerProps;
}
