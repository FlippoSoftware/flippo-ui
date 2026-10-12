import { sva } from '@lynstack/class-recipe';

import type { VariantsOf } from '@lynstack/class-recipe';

const CONTROL_BUTTON = 'fl-control-button fl-interactive fl-focus-ring';

/**
 * Combobox: `inputGroup` is the control box around `icon`, `chips`, `input`, `clear` and `trigger`; the `popup`
 * lists the options. The autocomplete uses the same classes.
 */
export const combobox = sva({
    slots: [
        'inputGroup',
        'input',
        'icon',
        'trigger',
        'clear',
        'value',
        'chips',
        'chip',
        'chipLabel',
        'chipRemove',
        'positioner',
        'popup',
        'list',
        'row',
        'item',
        'itemIndicator',
        'group',
        'groupLabel',
        'empty',
        'status',
        'separator',
        'arrow',
        'backdrop'
    ],
    base: {
        inputGroup: 'fl-combobox-input-group fl-control',
        input: 'fl-combobox-input',
        icon: 'fl-combobox-icon fl-icon',
        trigger: `fl-combobox-trigger ${CONTROL_BUTTON}`,
        clear: CONTROL_BUTTON,
        value: 'fl-combobox-value',
        chips: 'fl-combobox-chips',
        chip: 'fl-combobox-chip fl-text-label-default',
        chipLabel: 'fl-combobox-chip-label',
        chipRemove: `fl-combobox-chip-remove ${CONTROL_BUTTON}`,
        positioner: 'fl-combobox-positioner',
        popup: 'fl-combobox-popup fl-popup',
        list: 'fl-combobox-list',
        row: 'fl-combobox-row',
        item: 'fl-combobox-item fl-item fl-text-body-minus-default',
        itemIndicator: 'fl-combobox-item-indicator',
        group: 'fl-combobox-group',
        groupLabel: 'fl-combobox-group-label fl-text-label-default',
        empty: 'fl-combobox-empty fl-text-body-minus-default',
        status: 'fl-combobox-status fl-text-body-minus-default',
        separator: 'fl-combobox-separator',
        arrow: 'fl-arrow',
        backdrop: 'fl-combobox-backdrop fl-backdrop'
    },
    variants: {
        appearance: {
            light: { inputGroup: 'fl-control--light' },
            inverted: { inputGroup: 'fl-control--inverted' }
        },
        size: {
            small: { inputGroup: 'fl-control--small fl-text-body-minus-weaker' },
            medium: { inputGroup: 'fl-control--medium fl-text-body-minus-weaker' },
            large: { inputGroup: 'fl-control--large fl-text-body-weaker' }
        },
        /** The selected values are chips inside the input group (`multiple`). */
        chips: {
            true: { inputGroup: 'fl-combobox-input-group--chips' },
            false: {}
        }
    },
    defaultVariants: {
        appearance: 'light',
        size: 'medium',
        chips: false
    }
});

/** Autocomplete: the same parts and classes as the combobox. */
export const autocomplete = combobox;

export type ComboboxVariants = VariantsOf<typeof combobox>;
