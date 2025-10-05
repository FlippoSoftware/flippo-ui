import React from 'react';

import { useRenderElement } from '~@lib/hooks';
import { popupStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { usePopoverRootContext } from '../root/PopoverRootContext';

const customStyleHookMapping: StateAttributesMapping<PopoverBackdrop.State> = {
    ...popupStateMapping,
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

    const {
        open,
        mounted,
        transitionStatus,
        openReason,
        backdropRef
    } = usePopoverRootContext();

    const state: PopoverBackdrop.State = React.useMemo(
        () => ({
            open,
            transitionStatus
        }),
        [open, transitionStatus]
    );

    const element = useRenderElement('div', componentProps, {
        state,
        ref: [backdropRef, ref],
        props: [{
            role: 'presentation',
            hidden: !mounted,
            style: {
                pointerEvents: openReason === 'trigger-hover' ? 'none' : undefined,
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }
        }, elementProps],
        customStyleHookMapping
    });

    return element;
}

export namespace PopoverBackdrop {
    export type State = {
        /**
         * Whether the popover is currently open.
         */
        open: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = HeadlessUIComponentProps<'div', State>;
}
