import React from 'react';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { popupStateMapping as baseMapping } from '~@lib/popupStateMapping';
import { REASONS } from '~@lib/reason';
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

    const open = store.useState('open');
    const mounted = store.useState('mounted');
    const transitionStatus = store.useState('transitionStatus');
    const openReason = store.useState('openChangeReason');

    const state: PopoverBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [store.context.backdropRef, ref],
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                pointerEvents: openReason === REASONS.triggerHover ? 'none' : undefined,
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps],
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
