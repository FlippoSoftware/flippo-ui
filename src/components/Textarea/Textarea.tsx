'use client';
import React from 'react';

import { Field } from '../Field';

export function Textarea(props: Textarea.Props) {
    return <Field.Control control={'textarea'} {...props} />;
}

export namespace Textarea {
    export type State = Field.Control.State;

    export type Props = Omit<Field.Control.TextAreaProps, 'control'>;
}
