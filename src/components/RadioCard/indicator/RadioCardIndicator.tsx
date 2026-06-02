import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useRadioCardRootContext } from '../root/RadioCardRootContext';
import { RadioCardRootDataAttributes } from '../root/RadioCardRootDataAttributes';

import type { RadioCardRoot } from '../root/RadioCardRoot';

const stateAttributesMapping = {
    checked(value: boolean): Record<string, string> {
        if (value) {
            return { [RadioCardRootDataAttributes.checked]: '' };
        }
        return { [RadioCardRootDataAttributes.unchecked]: '' };
    },
    disabled(value: boolean) {
        if (value) {
            return { [RadioCardRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    }
};

/**
 * Indicates whether the radio card is selected.
 * Renders a `<span>` element — conditionally mounted based on the checked state.
 *
 * @example
 * <RadioCard.Root value="pro">
 *   <RadioCard.Indicator />
 *   Pro plan
 * </RadioCard.Root>
 */
export function RadioCardIndicator(componentProps: RadioCardIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const rootState = useRadioCardRootContext();

    const rendered = rootState.checked;

    const { transitionStatus, setMounted } = useTransitionStatus(rendered);

    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

    const state: RadioCardIndicator.State = React.useMemo(
        () => ({ ...rootState, transitionStatus }),
        [rootState, transitionStatus]
    );

    const shouldRender = keepMounted || rendered;

    useOpenChangeComplete({
        open: rendered,
        ref: indicatorRef,
        onComplete() {
            if (!rendered) {
                setMounted(false);
            }
        }
    });

    const element = useRenderElement('span', componentProps, {
        enabled: shouldRender,
        ref: [ref, indicatorRef],
        state,
        props: elementProps,
        customStyleHookMapping: stateAttributesMapping
    });

    if (!shouldRender)
        return null;

    return element;
}

export type RadioCardIndicatorState = {
    transitionStatus: TransitionStatus;
} & RadioCardRoot.State;

export type RadioCardIndicatorProps = {
    /**
     * Whether to keep the element in the DOM when the card is not selected.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', RadioCardIndicator.State>;

export namespace RadioCardIndicator {
    export type State = RadioCardIndicatorState;
    export type Props = RadioCardIndicatorProps;
}
