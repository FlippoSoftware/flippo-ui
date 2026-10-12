import React from 'react';

import { SelectTriggerMachine } from '@flippo-software/core-components/select';

import { toReactProps, useMachine, useMachineState, useTracker } from '~@lib/core';
import { useRenderElement } from '~@lib/hooks';
import { pressableTriggerOpenStateMapping } from '~@lib/popupStateMapping';

import type { StateAttributesMapping } from '~@lib/getStyleHookProps';
import type { HeadlessUIComponentProps, NativeButtonProps } from '~@lib/types';

import { fieldValidityMapping } from '../../Field/utils/constants';
import { useLabelableContext } from '../../LabelableProvider';
import { useSelectRoot } from '../root/SelectRootContext';

import type { FieldRoot } from '../../Field/root/FieldRoot';

const _BOUNDARY_OFFSET = 2;
const _SELECTED_DELAY = 400;
const _UNSELECTED_DELAY = 200;

const customStyleHookMapping: StateAttributesMapping<SelectTrigger.State> = {
    ...pressableTriggerOpenStateMapping,
    ...fieldValidityMapping,
    value: () => null
};

/**
 * A button that opens the select menu.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectTrigger(componentProps: SelectTrigger.Props) {
    const {
        /* eslint-disable unused-imports/no-unused-vars */
        render,
        className,
        /* eslint-enable unused-imports/no-unused-vars */
        ref,
        id,
        disabled = false,
        nativeButton = true,
        ...elementProps
    } = componentProps;

    const root = useSelectRoot();
    const { labelId } = useLabelableContext();

    const trigger = useMachine((options) => new SelectTriggerMachine(root, options), { id, disabled, nativeButton });
    const state: SelectTrigger.State = useMachineState(trigger);
    const track = useTracker();

    return useRenderElement('button', componentProps, {
        ref: [ref, trigger.setElement],
        state,
        customStyleHookMapping,
        props: [elementProps, (props) => track(() => toReactProps(trigger.getTriggerProps(props, labelId)))]
    });
}

export type SelectTriggerState = {
    /** Whether the select popup is currently open. */
    open: boolean;
    /** Whether the select popup is readonly. */
    readOnly: boolean;
    /** The value of the currently selected item. */
    value: any;
    /** Whether the trigger is a placeholder. */
    placeholder: boolean;
} & FieldRoot.State;

export type SelectTriggerProps = {
    children?: React.ReactNode;
    /** Whether the component should ignore user interaction. */
    disabled?: boolean;
} & NativeButtonProps &
    HeadlessUIComponentProps<'button', SelectTrigger.State>;

export namespace SelectTrigger {
    export type State = SelectTriggerState;
    export type Props = SelectTriggerProps;
}
