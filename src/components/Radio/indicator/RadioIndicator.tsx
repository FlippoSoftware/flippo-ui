import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';
import { useRenderElement } from '~@lib/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { useRadioRootContext } from '../root/RadioRootContext';
import { radioStyleHookMapping } from '../utils/styleHooks';

/**
 * Indicates whether the radio button is selected.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Radio](https://base-ui.com/react/components/radio)
 */
export function RadioIndicator(componentProps: RadioIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const rootState = useRadioRootContext();

    const rendered = rootState.checked;

    const { transitionStatus, setMounted } = useTransitionStatus(rendered);

    const state: RadioIndicator.State = React.useMemo(
        () => ({
            ...rootState,
            transitionStatus
        }),
        [rootState, transitionStatus]
    );

    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

    const shouldRender = keepMounted || rendered;

    const element = useRenderElement('span', componentProps, {
        enabled: shouldRender,
        ref: [ref, indicatorRef],
        state,
        props: elementProps,
        customStyleHookMapping: radioStyleHookMapping
    });

    useOpenChangeComplete({
        open: rendered,
        ref: indicatorRef,
        onComplete() {
            if (!rendered) {
                setMounted(false);
            }
        }
    });

    if (!shouldRender) {
        return null;
    }

    return element;
}

export namespace RadioIndicator {
    export type State = {
        /**
         * Whether the radio button is currently selected.
         */
        checked: boolean;
        transitionStatus: TransitionStatus;
    };

    export type Props = {
        /**
         * Whether to keep the HTML element in the DOM when the radio button is inactive.
         * @default false
         */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'span', State>;
}
