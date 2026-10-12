import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

const ITEM = 'fl-menu-item fl-item fl-text-body-minus-default';

/**
 * Menu (Figma "Menu Item"). Call it once per item kind: `menu({ tone: 'destructive' }).item` for "Delete".
 * Style the trigger with `button()`.
 */
export const menu = sva({
    slots: [
        'positioner',
        'popup',
        'arrow',
        'backdrop',
        'item',
        'linkItem',
        'checkboxItem',
        'radioItem',
        'submenuTrigger',
        'itemIndicator',
        'itemEnd',
        'group',
        'groupLabel',
        'radioGroup',
        'separator'
    ],
    base: {
        positioner: 'fl-menu-positioner',
        popup: 'fl-menu-popup fl-popup',
        arrow: 'fl-arrow',
        backdrop: 'fl-menu-backdrop fl-backdrop',
        item: ITEM,
        linkItem: ITEM,
        checkboxItem: ITEM,
        radioItem: ITEM,
        submenuTrigger: `${ITEM} fl-menu-submenu-trigger`,
        itemIndicator: 'fl-menu-item-indicator',
        itemEnd: 'fl-menu-item-end fl-text-label-default',
        group: 'fl-menu-group',
        groupLabel: 'fl-menu-group-label fl-text-label-default',
        radioGroup: 'fl-menu-radio-group',
        separator: 'fl-menu-separator'
    },
    variants: {
        tone: {
            default: {},
            destructive: {
                item: 'fl-item--destructive',
                linkItem: 'fl-item--destructive'
            }
        }
    },
    defaultVariants: {
        tone: 'default'
    }
});

export type MenuVariants = VariantsOf<typeof menu>;
