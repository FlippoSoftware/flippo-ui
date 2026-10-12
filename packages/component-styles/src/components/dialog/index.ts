import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

import { button } from '../button';

/** Dialog: `backdrop`, `popup`, `title`, `description`, `close` and `actions`. Style the trigger with `button()`. */
export const dialog = sva({
    slots: ['backdrop', 'popup', 'title', 'description', 'close', 'actions'],
    base: {
        backdrop: 'fl-dialog-backdrop fl-backdrop',
        popup: 'fl-dialog-popup',
        title: 'fl-dialog-title fl-text-title-3-default',
        description: 'fl-dialog-description fl-text-body-weaker',
        close: `fl-dialog-close ${button({ variant: 'label', size: 'small', iconOnly: true })}`,
        actions: 'fl-dialog-actions'
    },
    variants: {
        size: {
            small: { popup: 'fl-dialog-popup--small' },
            medium: { popup: 'fl-dialog-popup--medium' },
            large: { popup: 'fl-dialog-popup--large' }
        }
    },
    defaultVariants: {
        size: 'small'
    }
});

export type DialogVariants = VariantsOf<typeof dialog>;
