'use client';
import type * as React from 'react';

import { Input as Primitive } from '@flippo-ui/headless-components/input';

/** Both Input and Textarea expose the Field control context. */
export function InputBody(props: React.ComponentPropsWithRef<'div'>) {
    const { state } = Primitive.useInputControl();
    const attributes: Record<string, string> = {};
    for (const [name, value] of Object.entries(state)) {
        if (value === true) attributes[`data-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`] = '';
    }
    return <div {...attributes} {...props} />;
}

export function InputClear({ onClick, children = '×', ...props }: React.ComponentPropsWithRef<'button'>) {
    const { value, state } = Primitive.useInputControl();
    if (!value) return null;
    return (
        <button
            type='button'
            aria-label='Clear input'
            disabled={state.disabled}
            {...props}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                const input = event.currentTarget.closest('.fl-input-root')?.querySelector('input');
                if (!input) return;
                // Go through the native input event so Field owns change, validation and controlled values.
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(input, '');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.focus();
            }}
        >
            {children}
        </button>
    );
}
