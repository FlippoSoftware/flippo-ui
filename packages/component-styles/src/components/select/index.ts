import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

/** Select: a control-like `trigger` and a `popup` of options. */
export const select = sva({
    slots: [
        'trigger',
        'value',
        'icon',
        'positioner',
        'popup',
        'list',
        'item',
        'itemText',
        'itemIndicator',
        'group',
        'groupLabel',
        'separator',
        'arrow',
        'backdrop',
        'scrollUpArrow',
        'scrollDownArrow'
    ],
    base: {
        trigger: 'fl-select-trigger fl-control',
        value: 'fl-select-value',
        icon: 'fl-select-icon fl-icon',
        positioner: 'fl-select-positioner',
        popup: 'fl-select-popup fl-popup',
        list: 'fl-select-list',
        item: 'fl-select-item fl-item fl-text-body-minus-default',
        itemText: 'fl-select-item-text',
        itemIndicator: 'fl-select-item-indicator',
        group: 'fl-select-group',
        groupLabel: 'fl-select-group-label fl-text-label-default',
        separator: 'fl-select-separator',
        arrow: 'fl-arrow',
        backdrop: 'fl-select-backdrop fl-backdrop',
        scrollUpArrow: 'fl-select-scroll-arrow',
        scrollDownArrow: 'fl-select-scroll-arrow'
    },
    variants: {
        appearance: {
            light: { trigger: 'fl-control--light' },
            inverted: { trigger: 'fl-control--inverted' }
        },
        size: {
            small: { trigger: 'fl-control--small fl-text-body-minus-default' },
            medium: { trigger: 'fl-control--medium fl-text-body-minus-default' },
            large: { trigger: 'fl-control--large fl-text-body-default' }
        }
    },
    defaultVariants: {
        appearance: 'light',
        size: 'medium'
    }
});

export type SelectVariants = VariantsOf<typeof select>;
