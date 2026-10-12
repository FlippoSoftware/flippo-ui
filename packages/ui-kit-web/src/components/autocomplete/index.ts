import { autocomplete as recipe } from '@flippo-software/component-styles/autocomplete';
import { iconMarkup } from '@flippo-software/component-styles/icons';
import * as Primitive from '@flippo-software/web-components/autocomplete';
import * as Dependency from '@flippo-software/web-components/combobox';

import { inputGroupAnchor } from '../../lib/inputGroupAnchor';
import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';
import { define as defineDependency } from '../combobox';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const AutocompleteElement: StyledConstructor<typeof Primitive.elements, typeof recipe> = styled(
    Primitive.elements,
    recipe,
    'autocomplete',
    'root',
    true,
    undefined,
    { defaults: { openOnInputClick: true } }
);
export type AutocompleteElement = InstanceType<typeof AutocompleteElement>;
export const AutocompleteInputElement: StyledConstructor<typeof Dependency.elements.input, typeof recipe> = styled(
    Dependency.elements.input,
    recipe,
    'autocomplete',
    'input',
    false
);
export type AutocompleteInputElement = InstanceType<typeof AutocompleteInputElement>;
export const AutocompleteTriggerElement: StyledConstructor<typeof Dependency.elements.trigger, typeof recipe> = styled(
    Dependency.elements.trigger,
    recipe,
    'autocomplete',
    'trigger',
    false,
    undefined,
    { content: iconMarkup('chevron-down') }
);
export type AutocompleteTriggerElement = InstanceType<typeof AutocompleteTriggerElement>;
export const AutocompleteIconElement: StyledConstructor<typeof Dependency.elements.icon, typeof recipe> = styled(
    Dependency.elements.icon,
    recipe,
    'autocomplete',
    'icon',
    false
);
export type AutocompleteIconElement = InstanceType<typeof AutocompleteIconElement>;
export const AutocompleteClearElement: StyledConstructor<typeof Dependency.elements.clear, typeof recipe> = styled(
    Dependency.elements.clear,
    recipe,
    'autocomplete',
    'clear',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export type AutocompleteClearElement = InstanceType<typeof AutocompleteClearElement>;
export const AutocompleteValueElement: StyledConstructor<typeof Dependency.elements.value, typeof recipe> = styled(
    Dependency.elements.value,
    recipe,
    'autocomplete',
    'value',
    false
);
export type AutocompleteValueElement = InstanceType<typeof AutocompleteValueElement>;
export const AutocompleteChipsElement: StyledConstructor<typeof Dependency.elements.chips, typeof recipe> = styled(
    Dependency.elements.chips,
    recipe,
    'autocomplete',
    'chips',
    false
);
export type AutocompleteChipsElement = InstanceType<typeof AutocompleteChipsElement>;
export const AutocompleteChipElement: StyledConstructor<typeof Dependency.elements.chip, typeof recipe> = styled(
    Dependency.elements.chip,
    recipe,
    'autocomplete',
    'chip',
    false
);
export type AutocompleteChipElement = InstanceType<typeof AutocompleteChipElement>;
export const AutocompleteChipLabelElement: StyledConstructor<typeof Dependency.elements.chipLabel, typeof recipe> = styled(
    Dependency.elements.chipLabel,
    recipe,
    'autocomplete',
    'chipLabel',
    false
);
export type AutocompleteChipLabelElement = InstanceType<typeof AutocompleteChipLabelElement>;
export const AutocompleteChipRemoveElement: StyledConstructor<typeof Dependency.elements.chipRemove, typeof recipe> = styled(
    Dependency.elements.chipRemove,
    recipe,
    'autocomplete',
    'chipRemove',
    false,
    undefined,
    { content: iconMarkup('xmark') }
);
export type AutocompleteChipRemoveElement = InstanceType<typeof AutocompleteChipRemoveElement>;
export const AutocompleteBackdropElement: StyledConstructor<typeof Dependency.elements.backdrop, typeof recipe> = styled(
    Dependency.elements.backdrop,
    recipe,
    'autocomplete',
    'backdrop',
    false
);
export type AutocompleteBackdropElement = InstanceType<typeof AutocompleteBackdropElement>;
export const AutocompletePositionerElement: StyledConstructor<typeof Dependency.elements.positioner, typeof recipe> = styled(
    Dependency.elements.positioner,
    recipe,
    'autocomplete',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8 }, compute: { anchor: inputGroupAnchor('autocomplete') } }
);
export type AutocompletePositionerElement = InstanceType<typeof AutocompletePositionerElement>;
export const AutocompletePopupElement: StyledConstructor<typeof Dependency.elements.popup, typeof recipe> = styled(
    Dependency.elements.popup,
    recipe,
    'autocomplete',
    'popup',
    false
);
export type AutocompletePopupElement = InstanceType<typeof AutocompletePopupElement>;
export const AutocompleteArrowElement: StyledConstructor<typeof Dependency.elements.arrow, typeof recipe> = styled(
    Dependency.elements.arrow,
    recipe,
    'autocomplete',
    'arrow',
    false
);
export type AutocompleteArrowElement = InstanceType<typeof AutocompleteArrowElement>;
export const AutocompleteListElement: StyledConstructor<typeof Dependency.elements.list, typeof recipe> = styled(
    Dependency.elements.list,
    recipe,
    'autocomplete',
    'list',
    false
);
export type AutocompleteListElement = InstanceType<typeof AutocompleteListElement>;
export const AutocompleteEmptyElement: StyledConstructor<typeof Dependency.elements.empty, typeof recipe> = styled(
    Dependency.elements.empty,
    recipe,
    'autocomplete',
    'empty',
    false
);
export type AutocompleteEmptyElement = InstanceType<typeof AutocompleteEmptyElement>;
export const AutocompleteStatusElement: StyledConstructor<typeof Dependency.elements.status, typeof recipe> = styled(
    Dependency.elements.status,
    recipe,
    'autocomplete',
    'status',
    false
);
export type AutocompleteStatusElement = InstanceType<typeof AutocompleteStatusElement>;
export const AutocompleteItemElement: StyledConstructor<typeof Dependency.elements.item, typeof recipe> = styled(
    Dependency.elements.item,
    recipe,
    'autocomplete',
    'item',
    false
);
export type AutocompleteItemElement = InstanceType<typeof AutocompleteItemElement>;
export const AutocompleteItemIndicatorElement: StyledConstructor<typeof Dependency.elements.itemIndicator, typeof recipe> = styled(
    Dependency.elements.itemIndicator,
    recipe,
    'autocomplete',
    'itemIndicator',
    false,
    undefined,
    { content: iconMarkup('check') }
);
export type AutocompleteItemIndicatorElement = InstanceType<typeof AutocompleteItemIndicatorElement>;
export const AutocompleteGroupElement: StyledConstructor<typeof Dependency.elements.group, typeof recipe> = styled(
    Dependency.elements.group,
    recipe,
    'autocomplete',
    'group',
    false
);
export type AutocompleteGroupElement = InstanceType<typeof AutocompleteGroupElement>;
export const AutocompleteGroupLabelElement: StyledConstructor<typeof Dependency.elements.groupLabel, typeof recipe> = styled(
    Dependency.elements.groupLabel,
    recipe,
    'autocomplete',
    'groupLabel',
    false
);
export type AutocompleteGroupLabelElement = InstanceType<typeof AutocompleteGroupLabelElement>;
export const AutocompleteRowElement: StyledConstructor<typeof Dependency.elements.row, typeof recipe> = styled(
    Dependency.elements.row,
    recipe,
    'autocomplete',
    'row',
    false
);
export type AutocompleteRowElement = InstanceType<typeof AutocompleteRowElement>;
export const AutocompleteInputGroupElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'autocomplete',
    'inputGroup',
    false,
    undefined,
    { focusControlOnPress: true }
);
export type AutocompleteInputGroupElement = InstanceType<typeof AutocompleteInputGroupElement>;
export const AutocompleteSeparatorElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'autocomplete',
    'separator',
    false
);
export type AutocompleteSeparatorElement = InstanceType<typeof AutocompleteSeparatorElement>;
export const elements: {
    readonly root: typeof AutocompleteElement;
    readonly input: typeof AutocompleteInputElement;
    readonly trigger: typeof AutocompleteTriggerElement;
    readonly icon: typeof AutocompleteIconElement;
    readonly clear: typeof AutocompleteClearElement;
    readonly value: typeof AutocompleteValueElement;
    readonly chips: typeof AutocompleteChipsElement;
    readonly chip: typeof AutocompleteChipElement;
    readonly chipLabel: typeof AutocompleteChipLabelElement;
    readonly chipRemove: typeof AutocompleteChipRemoveElement;
    readonly backdrop: typeof AutocompleteBackdropElement;
    readonly positioner: typeof AutocompletePositionerElement;
    readonly popup: typeof AutocompletePopupElement;
    readonly arrow: typeof AutocompleteArrowElement;
    readonly list: typeof AutocompleteListElement;
    readonly empty: typeof AutocompleteEmptyElement;
    readonly status: typeof AutocompleteStatusElement;
    readonly item: typeof AutocompleteItemElement;
    readonly itemIndicator: typeof AutocompleteItemIndicatorElement;
    readonly group: typeof AutocompleteGroupElement;
    readonly groupLabel: typeof AutocompleteGroupLabelElement;
    readonly row: typeof AutocompleteRowElement;
    readonly inputGroup: typeof AutocompleteInputGroupElement;
    readonly separator: typeof AutocompleteSeparatorElement;
} = {
    root: AutocompleteElement,
    input: AutocompleteInputElement,
    trigger: AutocompleteTriggerElement,
    icon: AutocompleteIconElement,
    clear: AutocompleteClearElement,
    value: AutocompleteValueElement,
    chips: AutocompleteChipsElement,
    chip: AutocompleteChipElement,
    chipLabel: AutocompleteChipLabelElement,
    chipRemove: AutocompleteChipRemoveElement,
    backdrop: AutocompleteBackdropElement,
    positioner: AutocompletePositionerElement,
    popup: AutocompletePopupElement,
    arrow: AutocompleteArrowElement,
    list: AutocompleteListElement,
    empty: AutocompleteEmptyElement,
    status: AutocompleteStatusElement,
    item: AutocompleteItemElement,
    itemIndicator: AutocompleteItemIndicatorElement,
    group: AutocompleteGroupElement,
    groupLabel: AutocompleteGroupLabelElement,
    row: AutocompleteRowElement,
    inputGroup: AutocompleteInputGroupElement,
    separator: AutocompleteSeparatorElement
};
export function define(options: DefineOptions) {
    defineDependency(options);
    registerElements('autocomplete', elements, options);
}
