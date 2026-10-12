import { iconMarkup } from '@flippo-software/component-styles/icons';
import { select as recipe } from '@flippo-software/component-styles/select';
import * as Primitive from '@flippo-software/web-components/select';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const SelectElement: StyledConstructor<typeof Primitive.SelectElement, typeof recipe> = styled(
    Primitive.SelectElement,
    recipe,
    'select',
    'root',
    true
);
export const SelectTriggerElement: StyledConstructor<typeof Primitive.SelectTriggerElement, typeof recipe> = styled(
    Primitive.SelectTriggerElement,
    recipe,
    'select',
    'trigger',
    false
);
export const SelectValueElement: StyledConstructor<typeof Primitive.SelectValueElement, typeof recipe> = styled(
    Primitive.SelectValueElement,
    recipe,
    'select',
    'value',
    false
);
export const SelectIconElement: StyledConstructor<typeof Primitive.SelectIconElement, typeof recipe> = styled(
    Primitive.SelectIconElement,
    recipe,
    'select',
    'icon',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const SelectBackdropElement: StyledConstructor<typeof Primitive.SelectBackdropElement, typeof recipe> = styled(
    Primitive.SelectBackdropElement,
    recipe,
    'select',
    'backdrop',
    false
);
export const SelectPositionerElement: StyledConstructor<typeof Primitive.SelectPositionerElement, typeof recipe> = styled(
    Primitive.SelectPositionerElement,
    recipe,
    'select',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8, alignItemWithTrigger: false } }
);
export const SelectPopupElement: StyledConstructor<typeof Primitive.SelectPopupElement, typeof recipe> = styled(
    Primitive.SelectPopupElement,
    recipe,
    'select',
    'popup',
    false
);
export const SelectListElement: StyledConstructor<typeof Primitive.SelectListElement, typeof recipe> = styled(
    Primitive.SelectListElement,
    recipe,
    'select',
    'list',
    false
);
export const SelectArrowElement: StyledConstructor<typeof Primitive.SelectArrowElement, typeof recipe> = styled(
    Primitive.SelectArrowElement,
    recipe,
    'select',
    'arrow',
    false
);
export const SelectScrollUpArrowElement: StyledConstructor<typeof Primitive.SelectScrollUpArrowElement, typeof recipe> = styled(
    Primitive.SelectScrollUpArrowElement,
    recipe,
    'select',
    'scrollUpArrow',
    false,
    undefined,
    { content: iconMarkup('chevron-up') }
);
export const SelectScrollDownArrowElement: StyledConstructor<typeof Primitive.SelectScrollDownArrowElement, typeof recipe> = styled(
    Primitive.SelectScrollDownArrowElement,
    recipe,
    'select',
    'scrollDownArrow',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const SelectItemElement: StyledConstructor<typeof Primitive.SelectItemElement, typeof recipe> = styled(
    Primitive.SelectItemElement,
    recipe,
    'select',
    'item',
    false
);
export const SelectItemTextElement: StyledConstructor<typeof Primitive.SelectItemTextElement, typeof recipe> = styled(
    Primitive.SelectItemTextElement,
    recipe,
    'select',
    'itemText',
    false
);
export const SelectItemIndicatorElement: StyledConstructor<typeof Primitive.SelectItemIndicatorElement, typeof recipe> = styled(
    Primitive.SelectItemIndicatorElement,
    recipe,
    'select',
    'itemIndicator',
    false,
    undefined,
    { content: iconMarkup('check') }
);
export const SelectGroupElement: StyledConstructor<typeof Primitive.SelectGroupElement, typeof recipe> = styled(
    Primitive.SelectGroupElement,
    recipe,
    'select',
    'group',
    false
);
export const SelectGroupLabelElement: StyledConstructor<typeof Primitive.SelectGroupLabelElement, typeof recipe> = styled(
    Primitive.SelectGroupLabelElement,
    recipe,
    'select',
    'groupLabel',
    false
);
export const SelectSeparatorElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'select',
    'separator'
);
export const elements: {
    readonly root: typeof SelectElement;
    readonly trigger: typeof SelectTriggerElement;
    readonly value: typeof SelectValueElement;
    readonly icon: typeof SelectIconElement;
    readonly backdrop: typeof SelectBackdropElement;
    readonly positioner: typeof SelectPositionerElement;
    readonly popup: typeof SelectPopupElement;
    readonly list: typeof SelectListElement;
    readonly arrow: typeof SelectArrowElement;
    readonly scrollUpArrow: typeof SelectScrollUpArrowElement;
    readonly scrollDownArrow: typeof SelectScrollDownArrowElement;
    readonly item: typeof SelectItemElement;
    readonly itemText: typeof SelectItemTextElement;
    readonly itemIndicator: typeof SelectItemIndicatorElement;
    readonly group: typeof SelectGroupElement;
    readonly groupLabel: typeof SelectGroupLabelElement;
    readonly separator: typeof SelectSeparatorElement;
} = {
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
    groupLabel: SelectGroupLabelElement,
    separator: SelectSeparatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('select', elements, options);
}
export type SelectElement = InstanceType<typeof SelectElement>;
export type SelectTriggerElement = InstanceType<typeof SelectTriggerElement>;
export type SelectValueElement = InstanceType<typeof SelectValueElement>;
export type SelectIconElement = InstanceType<typeof SelectIconElement>;
export type SelectBackdropElement = InstanceType<typeof SelectBackdropElement>;
export type SelectPositionerElement = InstanceType<typeof SelectPositionerElement>;
export type SelectPopupElement = InstanceType<typeof SelectPopupElement>;
export type SelectListElement = InstanceType<typeof SelectListElement>;
export type SelectArrowElement = InstanceType<typeof SelectArrowElement>;
export type SelectScrollUpArrowElement = InstanceType<typeof SelectScrollUpArrowElement>;
export type SelectScrollDownArrowElement = InstanceType<typeof SelectScrollDownArrowElement>;
export type SelectItemElement = InstanceType<typeof SelectItemElement>;
export type SelectItemTextElement = InstanceType<typeof SelectItemTextElement>;
export type SelectItemIndicatorElement = InstanceType<typeof SelectItemIndicatorElement>;
export type SelectGroupElement = InstanceType<typeof SelectGroupElement>;
export type SelectGroupLabelElement = InstanceType<typeof SelectGroupLabelElement>;
export type SelectSeparatorElement = InstanceType<typeof SelectSeparatorElement>;
