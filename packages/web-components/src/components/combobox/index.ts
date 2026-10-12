import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { ComboboxArrowElement } from './arrow/ComboboxArrowElement';
import { ComboboxBackdropElement } from './backdrop/ComboboxBackdropElement';
import { ComboboxChipElement } from './chip/ComboboxChipElement';
import { ComboboxChipLabelElement } from './chip-label/ComboboxChipLabelElement';
import { ComboboxChipRemoveElement } from './chip-remove/ComboboxChipRemoveElement';
import { ComboboxChipsElement } from './chips/ComboboxChipsElement';
import { ComboboxClearElement } from './clear/ComboboxClearElement';
import { ComboboxEmptyElement } from './empty/ComboboxEmptyElement';
import { ComboboxGroupElement } from './group/ComboboxGroupElement';
import { ComboboxGroupLabelElement } from './group-label/ComboboxGroupLabelElement';
import { ComboboxIconElement } from './icon/ComboboxIconElement';
import { ComboboxInputElement } from './input/ComboboxInputElement';
import { ComboboxItemElement } from './item/ComboboxItemElement';
import { ComboboxItemIndicatorElement } from './item-indicator/ComboboxItemIndicatorElement';
import { ComboboxListElement } from './list/ComboboxListElement';
import { ComboboxPopupElement } from './popup/ComboboxPopupElement';
import { ComboboxPositionerElement } from './positioner/ComboboxPositionerElement';
import { ComboboxElement } from './root/ComboboxElement';
import { ComboboxRowElement } from './row/ComboboxRowElement';
import { ComboboxStatusElement } from './status/ComboboxStatusElement';
import { ComboboxTriggerElement } from './trigger/ComboboxTriggerElement';
import { ComboboxValueElement } from './value/ComboboxValueElement';

export * from './arrow/ComboboxArrowElement';
export * from './backdrop/ComboboxBackdropElement';
export * from './chip/ComboboxChipElement';
export * from './chip-label/ComboboxChipLabelElement';
export * from './chip-remove/ComboboxChipRemoveElement';
export * from './chips/ComboboxChipsElement';
export * from './clear/ComboboxClearElement';
export * from './empty/ComboboxEmptyElement';
export * from './group/ComboboxGroupElement';
export * from './group-label/ComboboxGroupLabelElement';
export * from './icon/ComboboxIconElement';
export * from './input/ComboboxInputElement';
export * from './item/ComboboxItemElement';
export * from './item-indicator/ComboboxItemIndicatorElement';
export * from './list/ComboboxListElement';
export * from './popup/ComboboxPopupElement';
export * from './positioner/ComboboxPositionerElement';
export * from './root/ComboboxElement';
export * from './root/ComboboxRootContext';
export * from './row/ComboboxRowElement';
export * from './status/ComboboxStatusElement';
export * from './trigger/ComboboxTriggerElement';
export * from './value/ComboboxValueElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: ComboboxElement,
    input: ComboboxInputElement,
    trigger: ComboboxTriggerElement,
    icon: ComboboxIconElement,
    clear: ComboboxClearElement,
    value: ComboboxValueElement,
    chips: ComboboxChipsElement,
    chip: ComboboxChipElement,
    chipLabel: ComboboxChipLabelElement,
    chipRemove: ComboboxChipRemoveElement,
    backdrop: ComboboxBackdropElement,
    positioner: ComboboxPositionerElement,
    popup: ComboboxPopupElement,
    arrow: ComboboxArrowElement,
    list: ComboboxListElement,
    empty: ComboboxEmptyElement,
    status: ComboboxStatusElement,
    item: ComboboxItemElement,
    itemIndicator: ComboboxItemIndicatorElement,
    group: ComboboxGroupElement,
    groupLabel: ComboboxGroupLabelElement,
    row: ComboboxRowElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-combobox…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('combobox', elements, options);
}
