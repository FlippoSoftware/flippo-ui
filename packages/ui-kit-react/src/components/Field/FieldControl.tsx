'use client';
import type { ReactElement } from 'react';

import { Field as Primitive } from '@flippo-software/react-components/field';

export function FieldControl({ className, children, ...props }: Primitive.Control.Props): ReactElement {
    const content = children ?? <Primitive.Control.Slot className={className} />;
    return props.control === 'textarea' ? (
        <Primitive.Control {...props}>{content}</Primitive.Control>
    ) : (
        <Primitive.Control {...props}>{content}</Primitive.Control>
    );
}
