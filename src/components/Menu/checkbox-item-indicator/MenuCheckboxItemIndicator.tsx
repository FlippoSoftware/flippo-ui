import React from 'react';

import { useOpenChangeComplete } from '@flippo-ui/hooks/use-open-change-complete';
import { useTransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import type { TransitionStatus } from '@flippo-ui/hooks/use-transition-status';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuCheckboxItemContext } from '../checkbox-item/MenuCheckboxItemContext';
import { itemMapping } from '../utils/stateAttributesMapping';

/**
 * Indicates whether the checkbox item is ticked.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuCheckboxItemIndicator(componentProps: MenuCheckboxItemIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        keepMounted = false,
        ...elementProps
    } = componentProps;

    const item = useMenuCheckboxItemContext();

    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

    const { transitionStatus, setMounted } = useTransitionStatus(item.checked);

    useOpenChangeComplete({
        open: item.checked,
        ref: indicatorRef,
        onComplete() {
            if (!item.checked) {
                setMounted(false);
            }
        }
    });

    const state: MenuCheckboxItemIndicator.State = React.useMemo(
        () => ({
            checked: item.checked,
            disabled: item.disabled,
            highlighted: item.highlighted,
            transitionStatus
        }),
        [item.checked, item.disabled, item.highlighted, transitionStatus]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        ref: [ref, indicatorRef],
        customStyleHookMapping: itemMapping,
        props: {
            'aria-hidden': true,
            ...elementProps
        },
        enabled: keepMounted || item.checked
    });

    return element;
}

export type MenuCheckboxItemIndicatorProps = {
    /**
     * Whether to keep the HTML element in the DOM when the checkbox item is not checked.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', MenuCheckboxItemIndicator.State>;

export type MenuCheckboxItemIndicatorState = {
    /**
     * Whether the checkbox item is currently ticked.
     */
    checked: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    highlighted: boolean;
    transitionStatus: TransitionStatus;
};

export namespace MenuCheckboxItemIndicator {
    export type Props = MenuCheckboxItemIndicatorProps;
    export type State = MenuCheckboxItemIndicatorState;
}
