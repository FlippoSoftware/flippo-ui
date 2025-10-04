'use client';
import React from 'react';

import { Field } from '../Field';

export function Textarea(props: Textarea.Props) {
    return <Field.Control control={'textarea'} {...props} />;
}

Textarea.Slot = Field.Control.Slot;
Textarea.useTextareaControl = Field.Control.useFieldControl;

export namespace Textarea {
    export type State = Field.Control.State;

    export type SlotProps = Field.Control.TextAreaSlotProps;

    export type Props = Omit<Field.Control.TextAreaProps, 'control'>;
}
