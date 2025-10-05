import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useMenuRadioItemContext } from '../radio-item/MenuRadioItemContext';
import { itemMapping } from '../utils/styleHookMapping';

/**
 * Indicates whether the radio item is selected.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Menu](https://base-ui.com/react/components/menu)
 */
export function MenuRadioItemIndicator(componentProps: MenuRadioItemIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        keepMounted = true,
        ref,
        ...elementProps
    } = componentProps;

    const item = useMenuRadioItemContext();

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

    const state: MenuRadioItemIndicator.State = React.useMemo(
        () => ({
            checked: item.checked,
            disabled: item.disabled,
            highlighted: item.highlighted,
            transitionStatus
        }),
        [
            item.checked,
            item.disabled,
            item.highlighted,
            transitionStatus
        ]
    );

    const element = useRenderElement('span', componentProps, {
        state,
        customStyleHookMapping: itemMapping,
        ref: [ref, indicatorRef],
        props: {
            'aria-hidden': true,
            ...elementProps
        },
        enabled: keepMounted || item.checked
    });

    return element;
}

export namespace MenuRadioItemIndicator {
    export type State = {
    /**
     * Whether the radio item is currently selected.
     */
        checked: boolean;
        /**
         * Whether the component should ignore user interaction.
         */
        disabled: boolean;
        highlighted: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
    /**
     * Whether to keep the HTML element in the DOM when the radio item is inactive.
     * @default true
     */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'span', State>;
}
