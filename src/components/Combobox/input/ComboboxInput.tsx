import React from 'react';

import { ComboboxInputMachine } from '@flippo-software/core-components/combobox';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useDirection } from '~@lib/hooks/useDirection';
import { useHeadlessUiId } from '~@lib/hooks/useHeadlessUiId';
import { useRenderElement } from '~@lib/hooks/useRenderElement';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { Side } from '~@lib/hooks/useAnchorPositioning';
import type { HeadlessUIComponentProps } from '~@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider/LabelableContext';
import { useComboboxChipsContext } from '../chips/ComboboxChipsContext';
import { useComboboxPositionerContext } from '../positioner/ComboboxPositionerContext';
import { useComboboxRootMachine } from '../root/ComboboxRootContext';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const stateAttributesMapping: StateAttributesMapping<ComboboxInput.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping,
    popupSide: (side) => (side ? { 'data-popup-side': side } : null),
    listEmpty: (empty) => (empty ? { 'data-list-empty': '' } : null)
};

/**
 * A text input to search for items in the list.
 * Renders an `<input>` element.
 */
export function ComboboxInput(componentProps: ComboboxInput.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        disabled = false,
        id: idProp,
        ref,
        ...elementProps
    } = componentProps;

    const root = useComboboxRootMachine();
    const { labelId } = useLabelableContext();
    const chips = useComboboxChipsContext();
    const insidePopup = Boolean(useComboboxPositionerContext(true));
    const direction = useDirection();
    const id = useHeadlessUiId(idProp) as string;

    const input = useMachine((options) => new ComboboxInputMachine(root, options, { insidePopup, chips, direction }), {
        id,
        disabled
    });
    const track = useTracker();
    const state: ComboboxInput.State = useMachineState(input);

    return useRenderElement('input', componentProps, {
        state,
        ref: [ref, input.setElement],
        props: [elementProps, (props) => track(() => toReactProps(input.getInputProps(props, labelId)))],
        customStyleHookMapping: stateAttributesMapping
    });
}

export type ComboboxInputState = {
    /**
     * Whether the corresponding popup is open.
     */
    open: boolean;
    /**
     * Indicates which side the corresponding popup is positioned relative to its anchor.
     */
    popupSide: Side | null;
    /**
     * Present when the corresponding items list is empty.
     */
    listEmpty: boolean;
    /**
     * Whether the component should ignore user edits.
     */
    readOnly: boolean;
} & FieldRoot.State;

export type ComboboxInputProps = {
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
} & HeadlessUIComponentProps<'input', ComboboxInput.State>;

export namespace ComboboxInput {
    export type State = ComboboxInputState;
    export type Props = ComboboxInputProps;
}
