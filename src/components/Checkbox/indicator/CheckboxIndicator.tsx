'use client';

import React from 'react';

import { useOpenChangeComplete, useTransitionStatus } from '@flippo-ui/hooks';

import type { TransitionStatus } from '@flippo-ui/hooks';

import { useRenderElement } from '@lib/hooks';
import { transitionStatusMapping } from '@lib/styleHookMapping';

import type { CustomStyleHookMapping } from '@lib/getStyleHookProps';
import type { HeadlessUIComponentProps } from '@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useCheckboxRootContext } from '../root/CheckboxRootContext';
import { useCustomStyleHookMapping } from '../utils/useCustomStyleHookMapping';

import type { CheckboxRoot } from '../root/CheckboxRoot';

/**
 * Indicates whether the checkbox is ticked.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Checkbox](https://base-ui.com/react/components/checkbox)
 */
export function CheckboxIndicator(componentProps: CheckboxIndicator.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        className,
        render,
        /* eslint-enable unused-imports/no-unused-vars */
        keepMounted = false,
        ref,
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

    const baseStyleHookMapping = useCustomStyleHookMapping(rootState);

    const customStyleHookMapping: CustomStyleHookMapping<CheckboxIndicator.State> = React.useMemo(
        () => ({
            ...baseStyleHookMapping,
            ...transitionStatusMapping,
            ...fieldValidityMapping
        }),
        [baseStyleHookMapping]
    );

    const shouldRender = keepMounted || rendered;

    const element = useRenderElement('span', componentProps, {
        enabled: shouldRender,
        ref: [ref, indicatorRef],
        state,
        customStyleHookMapping,
        props: elementProps
    });

    if (!shouldRender) {
        return null;
    }

    return element;
}

export namespace CheckboxIndicator {
    export type State = {
        transitionStatus: TransitionStatus;
    } & CheckboxRoot.State;

    export type Props = {
        /**
         * Whether to keep the element in the DOM when the checkbox is not checked.
         * @default false
         */
        keepMounted?: boolean;
    } & HeadlessUIComponentProps<'span', State>;
}
