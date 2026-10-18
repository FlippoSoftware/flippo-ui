import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Segmented control: `root` is the track, `item` a segment. */
export const segmentedControl = sva({
    slots: ['root', 'item'],
    base: {
        root: 'fl-segmented-control-root',
        item: 'fl-segmented-control-item fl-interactive fl-focus-ring fl-text-body-minus-stronger'
    },
    variants: {
        size: {
            small: { root: 'fl-segmented-control-root--small' },
            medium: {},
            large: { root: 'fl-segmented-control-root--large' }
        },
        /** No row margins: the track is only as high as itself (a dense layout). */
        compact: {
            true: { root: 'fl-segmented-control-root--compact' },
            false: {}
        }
    },
    defaultVariants: {
        size: 'medium',
        compact: false
    }
});

export type SegmentedControlVariants = VariantsOf<typeof segmentedControl>;
