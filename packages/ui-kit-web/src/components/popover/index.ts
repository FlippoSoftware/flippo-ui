import { iconMarkup } from '@flippo-software/component-styles/icons';
import { popover as recipe } from '@flippo-software/component-styles/popover';
import * as Primitive from '@flippo-software/web-components/popover';

import { registerElements } from '../../lib/register';
import { PresentationElement, styled } from '../../lib/styled';

import type { DefineOptions } from '../../lib/register';
import type { StyledConstructor } from '../../lib/styled';
export const PopoverElement: StyledConstructor<typeof Primitive.PopoverElement, typeof recipe> = styled(
    Primitive.PopoverElement,
    recipe,
    'popover',
    'root',
    true
);
export const PopoverTriggerElement: StyledConstructor<typeof Primitive.PopoverTriggerElement, typeof recipe> = styled(
    Primitive.PopoverTriggerElement,
    recipe,
    'popover',
    'trigger',
    false
);
export const PopoverPositionerElement: StyledConstructor<typeof Primitive.PopoverPositionerElement, typeof recipe> = styled(
    Primitive.PopoverPositionerElement,
    recipe,
    'popover',
    'positioner',
    false,
    undefined,
    { defaults: { sideOffset: 8 } }
);
export const PopoverPopupElement: StyledConstructor<typeof Primitive.PopoverPopupElement, typeof recipe> = styled(
    Primitive.PopoverPopupElement,
    recipe,
    'popover',
    'popup',
    false
);
export const PopoverArrowElement: StyledConstructor<typeof Primitive.PopoverArrowElement, typeof recipe> = styled(
    Primitive.PopoverArrowElement,
    recipe,
    'popover',
    'arrow',
    false
);
export const PopoverCloseElement: StyledConstructor<typeof Primitive.PopoverCloseElement, typeof recipe> = styled(
    Primitive.PopoverCloseElement,
    recipe,
    'popover',
    'close',
    false,
    undefined,
    { bareAsChild: true, content: iconMarkup('xmark') }
);
export const PopoverTitleElement: StyledConstructor<typeof Primitive.PopoverTitleElement, typeof recipe> = styled(
    Primitive.PopoverTitleElement,
    recipe,
    'popover',
    'title',
    false
);
export const PopoverDescriptionElement: StyledConstructor<typeof Primitive.PopoverDescriptionElement, typeof recipe> = styled(
    Primitive.PopoverDescriptionElement,
    recipe,
    'popover',
    'description',
    false
);
export const PopoverBackdropElement: StyledConstructor<typeof PresentationElement, typeof recipe> = styled(
    PresentationElement,
    recipe,
    'popover',
    'backdrop'
);
export const elements: {
    readonly root: typeof PopoverElement;
    readonly trigger: typeof PopoverTriggerElement;
    readonly positioner: typeof PopoverPositionerElement;
    readonly popup: typeof PopoverPopupElement;
    readonly arrow: typeof PopoverArrowElement;
    readonly close: typeof PopoverCloseElement;
    readonly title: typeof PopoverTitleElement;
    readonly description: typeof PopoverDescriptionElement;
    readonly backdrop: typeof PopoverBackdropElement;
} = {
    root: PopoverElement,
    trigger: PopoverTriggerElement,
    positioner: PopoverPositionerElement,
    popup: PopoverPopupElement,
    arrow: PopoverArrowElement,
    close: PopoverCloseElement,
    title: PopoverTitleElement,
    description: PopoverDescriptionElement,
    backdrop: PopoverBackdropElement
} as const;
export function define(options: DefineOptions) {
    registerElements('popover', elements, options);
}
export type PopoverElement = InstanceType<typeof PopoverElement>;
export type PopoverTriggerElement = InstanceType<typeof PopoverTriggerElement>;
export type PopoverPositionerElement = InstanceType<typeof PopoverPositionerElement>;
export type PopoverPopupElement = InstanceType<typeof PopoverPopupElement>;
export type PopoverArrowElement = InstanceType<typeof PopoverArrowElement>;
export type PopoverCloseElement = InstanceType<typeof PopoverCloseElement>;
export type PopoverTitleElement = InstanceType<typeof PopoverTitleElement>;
export type PopoverDescriptionElement = InstanceType<typeof PopoverDescriptionElement>;
export type PopoverBackdropElement = InstanceType<typeof PopoverBackdropElement>;
