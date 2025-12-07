import React from 'react';

import { FieldControl } from '../Field/control/FieldControl';
import { FieldControlSlot } from '../Field/slot/FieldControlSlot';

/**
 * A native input element that automatically works with [Field](https://base-ui.com/react/components/field).
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Input](https://base-ui.com/react/components/input)
 */
export function Input(props: Input.Props) {
    return <FieldControl control={'input'} {...props} />;
}

Input.Slot = FieldControlSlot;
Input.useInputControl = FieldControl.useFieldControl;

export namespace Input {
    export type State = FieldControl.State;

    export type SlotProps = FieldControl.InputSlotProps;

    export type Props = Omit<FieldControl.InputProps, 'control'>;
}
