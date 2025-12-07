import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { useTransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useComboboxItemContext } from '../item/ComboboxItemContext';

/**
 * The core implementation of the indicator is split here to avoid paying the hooks
 * costs unless the element needs to be mounted.
 */
const Inner = React.memo(
    (
        componentProps: ComboboxItemIndicator.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            render,
            className,
            /* eslint-enable unused-imports/no-unused-vars */
            ref,
            ...elementProps
        } = componentProps;

        const { selected } = useComboboxItemContext();

        const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

        const { transitionStatus, setMounted } = useTransitionStatus(selected);

        const state: ComboboxItemIndicator.State = React.useMemo(
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
 * Indicates whether the item is selected.
 * Renders a `<span>` element.
 */
export function ComboboxItemIndicator(componentProps: ComboboxItemIndicator.Props) {
    const keepMounted = componentProps.keepMounted ?? false;

    const { selected } = useComboboxItemContext();

    const shouldRender = keepMounted || selected;
    if (!shouldRender) {
        return null;
    }

    return <Inner {...componentProps} />;
}

export type ComboboxItemIndicatorProps = {
    children?: React.ReactNode;
    /**
     * Whether to keep the HTML element in the DOM when the item is not selected.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', ComboboxItemIndicator.State>;

export type ComboboxItemIndicatorState = {
    selected: boolean;
    transitionStatus: TransitionStatus;
};

export namespace ComboboxItemIndicator {
    export type Props = ComboboxItemIndicatorProps;
    export type State = ComboboxItemIndicatorState;
}
