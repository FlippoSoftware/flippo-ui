'use client';
import React from 'react';

import type { HeadlessUIComponentProps } from '@lib/types';

import { Field } from '../Field';

/**
 * A native input element that automatically works with [Field](https://base-ui.com/react/components/field).
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Input](https://base-ui.com/react/components/input)
 */
export function Input(props: Input.Props) {
    return <Field.Control {...props} />;
}

export namespace Input {
    export type State = Field.Control.State;

    export type Props = {
        /**
         * Callback fired when the `value` changes. Use when controlled.
         */
        onValueChange?: Field.Control.Props['onValueChange'];
        defaultValue?: Field.Control.Props['defaultValue'];
    } & HeadlessUIComponentProps<'input', State>;
}
