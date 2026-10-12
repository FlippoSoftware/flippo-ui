import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Avatar: `root`, `image` and `fallback` (initials). */
export const avatar = sva({
    slots: ['root', 'image', 'fallback'],
    base: {
        root: 'fl-avatar-root',
        image: 'fl-avatar-image',
        fallback: 'fl-avatar-fallback'
    },
    variants: {
        size: {
            'x-small': { root: 'fl-avatar-root--x-small' },
            small: { root: 'fl-avatar-root--small' },
            medium: {},
            large: { root: 'fl-avatar-root--large' },
            'x-large': { root: 'fl-avatar-root--x-large' }
        },
        shape: {
            circle: {},
            square: { root: 'fl-avatar-root--square' }
        }
    },
    defaultVariants: {
        size: 'medium',
        shape: 'circle'
    }
});

export type AvatarVariants = VariantsOf<typeof avatar>;
