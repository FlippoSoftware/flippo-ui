import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Textarea: a multi-line control box (`root`, composes `.fl-control`) around the native `control`. */
export const textarea = sva({
    slots: ['root', 'control', 'icon'],
    base: {
        root: 'fl-textarea-root fl-control fl-text-body-minus-weaker',
        control: 'fl-textarea-control',
        icon: 'fl-input-icon fl-icon'
    },
    variants: {
        appearance: {
            light: { root: 'fl-control--light' },
            inverted: { root: 'fl-control--inverted' }
        }
    },
    defaultVariants: {
        appearance: 'light'
    }
});
export type TextareaVariants = VariantsOf<typeof textarea>;
