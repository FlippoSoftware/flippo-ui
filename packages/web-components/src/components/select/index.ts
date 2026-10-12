import { registerElements } from '../../lib/registerElements';

import type { DefineOptions } from '../../lib/registerElements';

import { SelectArrowElement } from './arrow/SelectArrowElement';
import { SelectBackdropElement } from './backdrop/SelectBackdropElement';
import { SelectGroupElement } from './group/SelectGroupElement';
import { SelectGroupLabelElement } from './group-label/SelectGroupLabelElement';
import { SelectIconElement } from './icon/SelectIconElement';
import { SelectItemElement } from './item/SelectItemElement';
import { SelectItemIndicatorElement } from './item-indicator/SelectItemIndicatorElement';
import { SelectItemTextElement } from './item-text/SelectItemTextElement';
import { SelectListElement } from './list/SelectListElement';
import { SelectPopupElement } from './popup/SelectPopupElement';
import { SelectPositionerElement } from './positioner/SelectPositionerElement';
import { SelectElement } from './root/SelectElement';
import { SelectScrollDownArrowElement } from './scroll-down-arrow/SelectScrollDownArrowElement';
import { SelectScrollUpArrowElement } from './scroll-up-arrow/SelectScrollUpArrowElement';
import { SelectTriggerElement } from './trigger/SelectTriggerElement';
import { SelectValueElement } from './value/SelectValueElement';

export * from './arrow/SelectArrowElement';
export * from './backdrop/SelectBackdropElement';
export * from './group/SelectGroupElement';
export * from './group-label/SelectGroupLabelElement';
export * from './icon/SelectIconElement';
export * from './item/SelectItemElement';
export * from './item-indicator/SelectItemIndicatorElement';
export * from './item-text/SelectItemTextElement';
export * from './list/SelectListElement';
export * from './popup/SelectPopupElement';
export * from './positioner/SelectPositionerElement';
export * from './root/SelectElement';
export * from './root/SelectRootContext';
export * from './scroll-down-arrow/SelectScrollDownArrowElement';
export * from './scroll-up-arrow/SelectScrollUpArrowElement';
export * from './trigger/SelectTriggerElement';
export * from './value/SelectValueElement';

/**
 * The elements of the component, by part.
 */
export const elements = {
    root: SelectElement,
    trigger: SelectTriggerElement,
    value: SelectValueElement,
    icon: SelectIconElement,
    backdrop: SelectBackdropElement,
    positioner: SelectPositionerElement,
    popup: SelectPopupElement,
    list: SelectListElement,
    arrow: SelectArrowElement,
    scrollUpArrow: SelectScrollUpArrowElement,
    scrollDownArrow: SelectScrollDownArrowElement,
    item: SelectItemElement,
    itemText: SelectItemTextElement,
    itemIndicator: SelectItemIndicatorElement,
    group: SelectGroupElement,
    groupLabel: SelectGroupLabelElement
} as const;

/**
 * Registers the elements of the component as `<prefix>-select…` tags.
 */
export function define(options: DefineOptions) {
    registerElements('select', elements, options);
}
