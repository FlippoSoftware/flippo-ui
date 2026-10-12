import React from 'react';

import { ComboboxTriggerMachine } from '@flippo-software/core-components/combobox';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider/LabelableContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const _BOUNDARY_OFFSET = 2;

const stateAttributesMapping: StateAttributesMapping<ComboboxTrigger.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping
};

/**
 * A button that opens the popup.
 * Renders a `<button>` element.
 */
export function ComboboxTrigger(componentProps: ComboboxTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        nativeButton = true,
        disabled = false,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const { labelId } = useLabelableContext();

    const trigger = useMachine((options) => new ComboboxTriggerMachine(root, options), { disabled, nativeButton });
    const track = useTracker();
    const state: ComboboxTrigger.State = useMachineState(trigger);

    return useRenderElement('button', componentProps, {
        state,
        ref: [ref, trigger.setElement],
        props: [elementProps, (props) => track(() => toReactProps(trigger.getTriggerProps(props, labelId)))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type ComboboxTriggerState = {
    /**
     * Whether the popup is open.
     */
    open: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
} & FieldRoot.State;

export type ComboboxTriggerProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', ComboboxTrigger.State>;

export namespace ComboboxTrigger {
    export type State = ComboboxTriggerState;
    export type Props = ComboboxTriggerProps;
}
