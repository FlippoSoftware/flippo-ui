import { sva } from '@lynstack/class-recipe';

/** Accordion: `root`, `item`, `header`, `trigger` with its `icon`, `panel` and the padded `content` inside it. */
export const accordion = sva({
    slots: ['root', 'item', 'header', 'trigger', 'icon', 'panel', 'content'],
    base: {
        root: 'fl-accordion-root',
        item: 'fl-accordion-item',
        header: 'fl-accordion-header',
        trigger: 'fl-accordion-trigger fl-interactive fl-focus-ring fl-text-body-stronger',
        icon: 'fl-accordion-icon fl-icon',
        panel: 'fl-accordion-panel',
        content: 'fl-accordion-content fl-text-body-minus-default'
    },
    variants: {}
});
