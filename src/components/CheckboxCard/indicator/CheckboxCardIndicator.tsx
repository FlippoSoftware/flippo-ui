import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';

import type { HeadlessUIComponentProps } from '~@lib/types';

import { useCheckboxCardRootContext } from '../root/CheckboxCardRootContext';
import { CheckboxCardRootDataAttributes } from '../root/CheckboxCardRootDataAttributes';

import type { CheckboxCardRoot } from '../root/CheckboxCardRoot';

const stateAttributesMapping = {
    checked(value: boolean): Record<string, string> {
        if (value) {
            return { [CheckboxCardRootDataAttributes.checked]: '' };
        }
        return { [CheckboxCardRootDataAttributes.unchecked]: '' };
    },
    indeterminate(value: boolean): Record<string, string> | null {
        if (value) {
            return { [CheckboxCardRootDataAttributes.indeterminate]: '' };
        }
        return null;
    },
    disabled(value: boolean) {
        if (value) {
            return { [CheckboxCardRootDataAttributes.disabled]: '' } as Record<string, string>;
        }
        return null;
    }
};

/**
 * Indicates whether the checkbox card is checked or indeterminate.
 * Renders a `<span>` element — conditionally mounted based on the checked state.
 *
 * @example
 * <CheckboxCard.Root value="emails">
 *   <CheckboxCard.Indicator />
 *   Email updates
 * </CheckboxCard.Root>
 */
export function CheckboxCardIndicator(componentProps: CheckboxCardIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const rootState = useCheckboxCardRootContext();

    const rendered = rootState.checked || rootState.indeterminate;

    const { transitionStatus, setMounted } = useTransitionStatus(rendered);

    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

    const state: CheckboxCardIndicator.State = React.useMemo(
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

export type CheckboxCardIndicatorState = {
    transitionStatus: TransitionStatus;
} & CheckboxCardRoot.State;

export type CheckboxCardIndicatorProps = {
    /**
     * Whether to keep the element in the DOM when the card is not checked.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', CheckboxCardIndicator.State>;

export namespace CheckboxCardIndicator {
    export type State = CheckboxCardIndicatorState;
    export type Props = CheckboxCardIndicatorProps;
}
