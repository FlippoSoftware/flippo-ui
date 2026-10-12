import React from 'react';

import { PopoverBackdrop as PopoverBackdropCore } from '@flippo-software/core-components/popover';

import type { TransitionStatus } from '@flippo-software/hooks/use-transition-status';

import { toReactProps, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';

const stateAttributesMapping: StateAttributesMapping<PopoverBackdrop.State> = {
    ...baseMapping,
    ...transitionStatusMapping
};

/**
 * An overlay displayed beneath the popover.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export function PopoverBackdrop(componentProps: PopoverBackdrop.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        ...elementProps
    } = componentProps;

    const { store } = usePopoverRootContext();

    const track = useTracker();
    const { open, transitionStatus } = track(() => PopoverBackdropCore.getState(store));

    const state: PopoverBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [store.context.backdropRef as React.RefObject<HTMLDivElement | null>, ref],
        props: [elementProps, (props) => track(() => toReactProps(PopoverBackdropCore.getProps(store, props)))],
        customStyleHookMapping: stateAttributesMapping
    });

    return element;
}

export type PopoverBackdropState = {
    /**
     * Whether the popover is currently open.
     */
    open: boolean;
    transitionStatus: TransitionStatus;
};

export type PopoverBackdropProps = {} & HeadlessUIComponentProps<'div', PopoverBackdrop.State>;

export namespace PopoverBackdrop {
    export type State = PopoverBackdropState;
    export type Props = PopoverBackdropProps;
}
