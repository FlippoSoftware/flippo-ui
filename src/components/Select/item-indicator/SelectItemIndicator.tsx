import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectItemContext } from '../item/SelectItemContext';

/**
 * The core implementation of the indicator is split here to avoid paying the hooks
 * costs unless the element needs to be mounted.
 */
const Inner = React.memo(
    (
        componentProps: SelectItemIndicator.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
            /* eslint-enable unused-imports/no-unused-vars */
            ref,
            ...elementProps
        } = componentProps;

        const { selected } = useSelectItemContext();

        const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

        const { transitionStatus, setMounted } = useTransitionStatus(selected);

        const state: SelectItemIndicator.State = React.useMemo(
            () => ({
                selected,
                transitionStatus
            }),
            [selected, transitionStatus]
        );

        const element = useRenderElement('span', componentProps, {
            ref: [ref, indicatorRef],
            state,
            props: [{
                'aria-hidden': true,
                'children': '✔️'
            }, elementProps],
            customStyleHookMapping: transitionStatusMapping
        });

        useOpenChangeComplete({
            open: selected,
            ref: indicatorRef,
            onComplete() {
                if (!selected) {
                    setMounted(false);
                }
            }
        });

        return element;
    }
);

/**
 * The core implementation of the indicator is split here to avoid paying the hooks
 * costs unless the element needs to be mounted.
 */
export function SelectItemIndicator(componentProps: SelectItemIndicator.Props) {
    const keepMounted = componentProps.keepMounted ?? false;

    const { selected } = useSelectItemContext();

    const shouldRender = keepMounted || selected;
    if (!shouldRender) {
        return null;
    }

    return <Inner {...componentProps} />;
}

export type SelectItemIndicatorState = {
    selected: boolean;
    transitionStatus: TransitionStatus;
};

export type SelectItemIndicatorProps = {
    children?: React.ReactNode;
    /** Whether to keep the HTML element in the DOM when the item is not selected. */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', SelectItemIndicator.State>;

export namespace SelectItemIndicator {
    export type State = SelectItemIndicatorState;
    export type Props = SelectItemIndicatorProps;
}
