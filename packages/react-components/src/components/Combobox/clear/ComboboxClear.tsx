import React from 'react';

import { ComboboxClearMachine } from '@flippo-software/core-components/combobox';

import type { TransitionStatus } from '@flippo-software/hooks';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { triggerOpenStateMapping } from '~@lib/popupStateMapping';
import { transitionStatusMapping } from '~@lib/styleHookMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { useComboboxRootMachine } from '../root/ComboboxRootContext';

const stateAttributesMapping: StateAttributesMapping<ComboboxClear.State> = {
    ...transitionStatusMapping,
    ...triggerOpenStateMapping
};

/**
 * Clears the value when clicked.
 * Renders a `<button>` element.
 */
export function ComboboxClear(componentProps: ComboboxClear.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        nativeButton = true,
        keepMounted = false,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();

    const clear = useMachine((options) => new ComboboxClearMachine(root, options), { disabled, nativeButton });
    const state: ComboboxClear.State = useMachineState(clear);
    const track = useTracker();

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, clear.setElement],
        props: [elementProps, (props) => track(() => toReactProps(clear.getClearProps(props)))],
        customStyleHookMapping: stateAttributesMapping,
        enabled: track(() => clear.shouldRender(keepMounted))
    });
}

export type ComboboxClearState = {
    /**
     * Whether the popup is open.
     */
    open: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    transitionStatus: TransitionStatus;
};

export type ComboboxClearProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the component should remain mounted in the DOM when not visible.
     * @default false
     */
    keepMounted?: boolean;
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', ComboboxClear.State>;

export namespace ComboboxClear {
    export type State = ComboboxClearState;
    export type Props = ComboboxClearProps;
}
