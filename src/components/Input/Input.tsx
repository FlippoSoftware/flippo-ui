'use client';
import React from 'react';

import { Field } from '../Field';

/**
 * A native input element that automatically works with [Field](https://base-ui.com/react/components/field).
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Input](https://base-ui.com/react/components/input)
 */
export function Input(props: Input.Props) {
    return <Field.Control control={'input'} {...props} />;
}

export namespace Input {
    export type State = Field.Control.State;

    export type Props = Omit<Field.Control.InputProps, 'control'>;
}
