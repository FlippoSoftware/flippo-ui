import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Pin input (Figma "Numeric"): `root`/`group` lay the cells out, each `pin` is one digit. */
export const pinInput = sva({
    slots: ['root', 'group', 'pin', 'focusFunnel'],
    base: {
        root: 'fl-pin-input-root',
        group: 'fl-pin-input-group',
        pin: 'fl-pin-input-pin fl-control',
        focusFunnel: 'fl-pin-input-focus-funnel'
    },
    variants: {
        appearance: {
            light: { pin: 'fl-control--light' },
            inverted: { pin: 'fl-control--inverted' }
        },
        size: {
            medium: { pin: 'fl-pin-input-pin--medium fl-text-heading-1-default' },
            large: { pin: 'fl-pin-input-pin--large fl-text-title-2-default' }
        }
    },
    defaultVariants: {
        appearance: 'light',
        size: 'large'
    }
});

export type PinInputVariants = VariantsOf<typeof pinInput>;
