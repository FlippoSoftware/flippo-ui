import { sva } from '@lynstack/class-recipe';

import { button } from '../button';

/**
 * Toast (Figma "Toast"): `viewport` stacks the `root`s; a root holds an `icon` (or a `timer`), the `content`
 * (`title`, `description`), an `action` and a `close` button. `data-type` colours the toast.
 */
export const toast = sva({
    slots: ['viewport', 'root', 'icon', 'timer', 'content', 'title', 'description', 'action', 'close'],
    base: {
        viewport: 'fl-toast-viewport',
        root: 'fl-toast-root',
        icon: 'fl-toast-icon fl-icon',
        timer: 'fl-toast-timer fl-text-label-stronger',
        content: 'fl-toast-content',
        title: 'fl-toast-title fl-text-body-minus-stronger',
        description: 'fl-toast-description fl-text-body-minus-default',
        action: button({ variant: 'secondary', size: 'x-small' }),
        close: button({ variant: 'label', size: 'small', iconOnly: true })
    },
    variants: {}
});
