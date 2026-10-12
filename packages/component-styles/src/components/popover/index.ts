import { sva } from '@lynstack/class-recipe';

import { button } from '../button';

/** Popover: a floating card. Style the trigger with `button()`. */
export const popover = sva({
    slots: ['positioner', 'popup', 'arrow', 'backdrop', 'title', 'description', 'close'],
    base: {
        positioner: 'fl-popover-positioner',
        popup: 'fl-popover-popup fl-popup',
        arrow: 'fl-arrow',
        backdrop: 'fl-popover-backdrop fl-backdrop',
        title: 'fl-popover-title fl-text-heading-3-default',
        description: 'fl-popover-description fl-text-body-minus-default',
        close: `fl-popover-close ${button({ variant: 'label', size: 'x-small', iconOnly: true })}`
    },
    variants: {}
});
