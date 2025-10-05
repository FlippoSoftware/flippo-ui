

import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useSelectItemContext } from '../item/SelectItemContext';

/**
 * The core implementation of the indicator is split here to avoid paying the hooks
 * costs unless the element needs to be mounted.
 */
const Inner = React.memo(
    (
        { ref: forwardedRef, ...componentProps }: SelectItemIndicator.Props
    ) => {
        const {
            /* eslint-disable unused-imports/no-unused-vars */
            className,
            render,
            keepMounted,
            /* eslint-enable unused-imports/no-unused-vars */
            ...elementProps
        } = componentProps;

        const { selected } = useSelectItemContext();

        const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

        const { mounted, transitionStatus, setMounted } = useTransitionStatus(selected);

        const state: SelectItemIndicator.State = React.useMemo(
            () => ({
                selected,
                transitionStatus
            }),
            [selected, transitionStatus]
        );

        const element = useRenderElement('span', componentProps, {
            ref: [forwardedRef, indicatorRef],
            state,
            props: [{
                'hidden': !mounted,
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
 * Indicates whether the select item is selected.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
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

export namespace SelectItemIndicator {
    export type State = {
        selected: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
        children?: React.ReactNode;
        /**
         * Whether to keep the HTML element in the DOM when the item is not selected.
         * @default false
         */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'span', State>;
}
