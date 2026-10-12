import { sva } from '@lynstack/class-recipe';

/** Fieldset: `root` and `legend`. */
export const fieldset = sva({
    slots: ['root', 'legend'],
    base: {
        root: 'fl-fieldset-root',
        legend: 'fl-fieldset-legend fl-text-heading-3-default'
    },
    variants: {}
});
