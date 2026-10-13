import { combobox as recipe } from '@flippo-software/component-styles/combobox';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/combobox';

import { inputGroupAnchor } from '~@lib/inputGroupAnchor';
import { registerElements } from '~@lib/register';
import { PresentationElement, styled } from '~@lib/styled';

import type { DefineOptions } from '~@lib/register';
import type { StyledConstructor } from '~@lib/styled';
export const ComboboxElement: StyledConstructor<typeof Primitive.ComboboxElement, typeof recipe> = styled(
    Primitive.ComboboxElement,
    recipe,
    'combobox',
    'root',
    true
);
export const ComboboxInputElement: StyledConstructor<typeof Primitive.ComboboxInputElement, typeof recipe> = styled(
    Primitive.ComboboxInputElement,
    recipe,
    'combobox',
    'input',
    false
);
export const ComboboxTriggerElement: StyledConstructor<typeof Primitive.ComboboxTriggerElement, typeof recipe> = styled(
    Primitive.ComboboxTriggerElement,
    recipe,
    'combobox',
    'trigger',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export const ComboboxIconElement: StyledConstructor<typeof Primitive.ComboboxIconElement, typeof recipe> = styled(
    Primitive.ComboboxIconElement,
    recipe,
    'combobox',
    'icon',
    false
);
export const ComboboxClearElement: StyledConstructor<typeof Primitive.ComboboxClearElement, typeof recipe> = styled(
    Primitive.ComboboxClearElement,
    recipe,
    'combobox',
    'clear',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export const ComboboxValueElement: StyledConstructor<typeof Primitive.ComboboxValueElement, typeof recipe> = styled(
    Primitive.ComboboxValueElement,
    recipe,
    'combobox',
    'value',
    false
);
export const ComboboxChipsElement: StyledConstructor<typeof Primitive.ComboboxChipsElement, typeof recipe> = styled(
    Primitive.ComboboxChipsElement,
    recipe,
    'combobox',
    'chips',
    false
);
export const ComboboxChipElement: StyledConstructor<typeof Primitive.ComboboxChipElement, typeof recipe> = styled(
    Primitive.ComboboxChipElement,
    recipe,
    'combobox',
    'chip',
    false
);
export const ComboboxChipLabelElement: StyledConstructor<typeof Primitive.ComboboxChipLabelElement, typeof recipe> = styled(
    Primitive.ComboboxChipLabelElement,
    recipe,
    'combobox',
    'chipLabel',
    false
);
export const ComboboxChipRemoveElement: StyledConstructor<typeof Primitive.ComboboxChipRemoveElement, typeof recipe> = styled(
    Primitive.ComboboxChipRemoveElement,
    recipe,
    'combobox',
    'chipRemove',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export const ComboboxBackdropElement: StyledConstructor<typeof Primitive.ComboboxBackdropElement, typeof recipe> = styled(
    Primitive.ComboboxBackdropElement,
    recipe,
    'combobox',
    'backdrop',
    false
);
export const ComboboxPositionerElement: StyledConstructor<typeof Primitive.ComboboxPositionerElement, typeof recipe> = styled(
    Primitive.ComboboxPositionerElement,
    recipe,
    'combobox',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8 }, compute: { anchor: inputGroupAnchor('combobox') } }
);
export const ComboboxPopupElement: StyledConstructor<typeof Primitive.ComboboxPopupElement, typeof recipe> = styled(
    Primitive.ComboboxPopupElement,
    recipe,
    'combobox',
    'popup',
    false
);
export const ComboboxArrowElement: StyledConstructor<typeof Primitive.ComboboxArrowElement, typeof recipe> = styled(
    Primitive.ComboboxArrowElement,
    recipe,
    'combobox',
    'arrow',
    false
);
export const ComboboxListElement: StyledConstructor<typeof Primitive.ComboboxListElement, typeof recipe> = styled(
    Primitive.ComboboxListElement,
    recipe,
    'combobox',
    'list',
    false
);
export const ComboboxEmptyElement: StyledConstructor<typeof Primitive.ComboboxEmptyElement, typeof recipe> = styled(
    Primitive.ComboboxEmptyElement,
    recipe,
    'combobox',
    'empty',
    false
);
export const ComboboxStatusElement: StyledConstructor<typeof Primitive.ComboboxStatusElement, typeof recipe> = styled(
    Primitive.ComboboxStatusElement,
    recipe,
    'combobox',
    'status',
    false
);
export const ComboboxItemElement: StyledConstructor<typeof Primitive.ComboboxItemElement, typeof recipe> = styled(
    Primitive.ComboboxItemElement,
    recipe,
    'combobox',
    'item',
    false
);
export const ComboboxItemIndicatorElement: StyledConstructor<typeof Primitive.ComboboxItemIndicatorElement, typeof recipe> = styled(
    Primitive.ComboboxItemIndicatorElement,
    recipe,
    'combobox',
    'itemIndicator',
    false,
    undefined,
    { content: iconMarkup('check') }
);
export const ComboboxGroupElement: StyledConstructor<typeof Primitive.ComboboxGroupElement, typeof recipe> = styled(
    Primitive.ComboboxGroupElement,
    recipe,
    'combobox',
    'group',
    false
);
export const ComboboxGroupLabelElement: StyledConstructor<typeof Primitive.ComboboxGroupLabelElement, typeof recipe> = styled(
    Primitive.ComboboxGroupLabelElement,
    recipe,
    'combobox',
    'groupLabel',
    false
);
export const ComboboxRowElement: StyledConstructor<typeof Primitive.ComboboxRowElement, typeof recipe> = styled(
    Primitive.ComboboxRowElement,
    recipe,
    'combobox',
    'row',
    false
);
export const ComboboxInputGroupElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'combobox',
    'inputGroup',
    false,
    undefined,
    { focusControlOnPress: true }
);
export const ComboboxSeparatorElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'combobox',
    'separator'
);
export const elements: {
    readonly root: typeof ComboboxElement;
    readonly input: typeof ComboboxInputElement;
    readonly trigger: typeof ComboboxTriggerElement;
    readonly icon: typeof ComboboxIconElement;
    readonly clear: typeof ComboboxClearElement;
    readonly value: typeof ComboboxValueElement;
    readonly chips: typeof ComboboxChipsElement;
    readonly chip: typeof ComboboxChipElement;
    readonly chipLabel: typeof ComboboxChipLabelElement;
    readonly chipRemove: typeof ComboboxChipRemoveElement;
    readonly backdrop: typeof ComboboxBackdropElement;
    readonly positioner: typeof ComboboxPositionerElement;
    readonly popup: typeof ComboboxPopupElement;
    readonly arrow: typeof ComboboxArrowElement;
    readonly list: typeof ComboboxListElement;
    readonly empty: typeof ComboboxEmptyElement;
    readonly status: typeof ComboboxStatusElement;
    readonly item: typeof ComboboxItemElement;
    readonly itemIndicator: typeof ComboboxItemIndicatorElement;
    readonly group: typeof ComboboxGroupElement;
    readonly groupLabel: typeof ComboboxGroupLabelElement;
    readonly row: typeof ComboboxRowElement;
    readonly inputGroup: typeof ComboboxInputGroupElement;
    readonly separator: typeof ComboboxSeparatorElement;
} = {
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
    row: ComboboxRowElement,
    inputGroup: ComboboxInputGroupElement,
    separator: ComboboxSeparatorElement
} as const;
export function define(options: DefineOptions) {
    registerElements('combobox', elements, options);
}
export type ComboboxElement = InstanceType<typeof ComboboxElement>;
export type ComboboxInputElement = InstanceType<typeof ComboboxInputElement>;
export type ComboboxTriggerElement = InstanceType<typeof ComboboxTriggerElement>;
export type ComboboxIconElement = InstanceType<typeof ComboboxIconElement>;
export type ComboboxClearElement = InstanceType<typeof ComboboxClearElement>;
export type ComboboxValueElement = InstanceType<typeof ComboboxValueElement>;
export type ComboboxChipsElement = InstanceType<typeof ComboboxChipsElement>;
export type ComboboxChipElement = InstanceType<typeof ComboboxChipElement>;
export type ComboboxChipLabelElement = InstanceType<typeof ComboboxChipLabelElement>;
export type ComboboxChipRemoveElement = InstanceType<typeof ComboboxChipRemoveElement>;
export type ComboboxBackdropElement = InstanceType<typeof ComboboxBackdropElement>;
export type ComboboxPositionerElement = InstanceType<typeof ComboboxPositionerElement>;
export type ComboboxPopupElement = InstanceType<typeof ComboboxPopupElement>;
export type ComboboxArrowElement = InstanceType<typeof ComboboxArrowElement>;
export type ComboboxListElement = InstanceType<typeof ComboboxListElement>;
export type ComboboxEmptyElement = InstanceType<typeof ComboboxEmptyElement>;
export type ComboboxStatusElement = InstanceType<typeof ComboboxStatusElement>;
export type ComboboxItemElement = InstanceType<typeof ComboboxItemElement>;
export type ComboboxItemIndicatorElement = InstanceType<typeof ComboboxItemIndicatorElement>;
export type ComboboxGroupElement = InstanceType<typeof ComboboxGroupElement>;
export type ComboboxGroupLabelElement = InstanceType<typeof ComboboxGroupLabelElement>;
export type ComboboxRowElement = InstanceType<typeof ComboboxRowElement>;
export type ComboboxInputGroupElement = InstanceType<typeof ComboboxInputGroupElement>;
export type ComboboxSeparatorElement = InstanceType<typeof ComboboxSeparatorElement>;
