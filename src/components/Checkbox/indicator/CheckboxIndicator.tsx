import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '~@lib/hooks';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useCheckboxRootContext } from '../root/CheckboxRootContext';
import { useStateAttributesMapping } from '../utils/useStateAttributesMapping';

import type { CheckboxRoot } from '../root/CheckboxRoot';

/**
 * Indicates whether the checkbox is ticked.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Checkbox](https://base-ui.com/react/components/checkbox)
 */export function CheckboxIndicator(componentProps: CheckboxIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        keepMounted = false,
        ...elementProps
    } = componentProps;

    const rootState = useCheckboxRootContext();

    const rendered = rootState.checked || rootState.indeterminate;

    const { transitionStatus, setMounted } = useTransitionStatus(rendered);

    const indicatorRef = React.useRef<HTMLSpanElement | null>(null);

    const state: CheckboxIndicator.State = React.useMemo(
        () => ({
            ...rootState,
            transitionStatus
        }),
        [rootState, transitionStatus]
    );

    useOpenChangeComplete({
        open: rendered,
        ref: indicatorRef,
        onComplete() {
            if (!rendered) {
                setMounted(false);
            }
        }
    });

    const baseStateAttributesMapping = useStateAttributesMapping(rootState);

    const stateAttributesMapping: StateAttributesMapping<CheckboxIndicator.State> = React.useMemo(
        () => ({
            ...baseStateAttributesMapping,
            ...transitionStatusMapping,
            ...fieldValidityMapping
        }),
        [baseStateAttributesMapping]
    );

    const shouldRender = keepMounted || rendered;

    const element = useRenderElement('span', componentProps, {
        enabled: shouldRender,
        ref: [ref, indicatorRef],
        state,
        customStyleHookMapping: stateAttributesMapping,
        props: elementProps
    });

    if (!shouldRender) {
        return null;
    }

    return element;
}

export type CheckboxIndicatorState = {
    transitionStatus: TransitionStatus;
} & CheckboxRoot.State;

export type CheckboxIndicatorProps = {
    /**
     * Whether to keep the element in the DOM when the checkbox is not checked.
     * @default false
     */
    keepMounted?: boolean;
} & HeadlessUIComponentProps<'span', CheckboxIndicator.State>;

export namespace CheckboxIndicator {
    export type State = CheckboxIndicatorState;
    export type Props = CheckboxIndicatorProps;
}
