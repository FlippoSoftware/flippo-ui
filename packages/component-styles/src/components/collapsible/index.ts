import { sva } from '@lynstack/class-recipe';

import { accordion } from '../accordion';

const accordionClasses = accordion();

/** Collapsible: `root`, `trigger` with its `icon`, `panel` and the padded `content` (the accordion's look). */
export const collapsible = sva({
    slots: ['root', 'trigger', 'icon', 'panel', 'content'],
    base: {
        root: 'fl-collapsible-root',
        trigger: accordionClasses.trigger,
        icon: accordionClasses.icon,
        panel: accordionClasses.panel,
        content: accordionClasses.content
    },
    variants: {}
});
